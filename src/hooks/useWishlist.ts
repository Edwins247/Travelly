import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  subscribeWishlist,
} from '@/services/users';
import { incrementPlaceLikes, decrementPlaceLikes, getPlaceById } from '@/services/places';
import { placeAnalytics } from '@/utils/analytics';
import { toast } from '@/store/toastStore';

export function useWishlist() {
  const user = useAuthStore((s) => s.user);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    let unsub: () => void;
    getUserWishlist(user.uid).then((ids) => {
      setWishlist(ids);
      setLoading(false);
      unsub = subscribeWishlist(user.uid, setWishlist);
    });
    return () => unsub?.();
  }, [user]);

  const toggle = useCallback(
    async (placeId: string, next: boolean) => {
      if (!user) return;

      try {
        if (next) {
          // 위시리스트에 추가 + 좋아요 수 증가
          await Promise.all([addToWishlist(user.uid, placeId), incrementPlaceLikes(placeId)]);

          // Analytics: 좋아요 이벤트 (place 정보 가져와서 추적)
          getPlaceById(placeId)
            .then((place) => {
              if (place) {
                placeAnalytics.likePlace(placeId, place.name, place.location.region);
              }
            })
            .catch(console.error);
        } else {
          // 위시리스트에서 제거 + 좋아요 수 감소
          await Promise.all([removeFromWishlist(user.uid, placeId), decrementPlaceLikes(placeId)]);

          // Analytics: 좋아요 취소 이벤트
          getPlaceById(placeId)
            .then((place) => {
              if (place) {
                placeAnalytics.unlikePlace(placeId, place.name, place.location.region);
              }
            })
            .catch(console.error);
        }
      } catch (error) {
        toast.error('Toggle 오류가 발생했습니다', '잠시 후 다시 시도해주세요.');
      }
    },
    [user],
  );

  return { wishlist, loading, toggle };
}
