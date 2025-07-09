// src/hooks/useWishlist.ts
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  subscribeWishlist,
} from '@/services/users';

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
      if (next) await addToWishlist(user.uid, placeId);
      else await removeFromWishlist(user.uid, placeId);
    },
    [user]
  );

  return { wishlist, loading, toggle };
}
