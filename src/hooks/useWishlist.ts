// src/hooks/useWishlist.ts
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  subscribeWishlist,
} from '@/services/users';
import { incrementPlaceLikes, decrementPlaceLikes } from '@/services/places';

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
          await Promise.all([
            addToWishlist(user.uid, placeId),
            incrementPlaceLikes(placeId)
          ]);
        } else {
          // 위시리스트에서 제거 + 좋아요 수 감소
          await Promise.all([
            removeFromWishlist(user.uid, placeId),
            decrementPlaceLikes(placeId)
          ]);
        }
      } catch (error) {
        console.error('Error toggling wishlist:', error);
      }
    },
    [user]
  );

  return { wishlist, loading, toggle };
}
