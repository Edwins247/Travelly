'use client';
import React, { useEffect, useState } from 'react';
import { getReviewsByPlace } from '@/services/reviews';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';
import { Review } from '@/types/review';

export function ReviewList({ placeId }: { placeId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getReviewsByPlace(placeId).then(setReviews);
  }, [placeId]);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">후기 ({reviews.length})</h2>
      <ReviewForm placeId={placeId} />
      <div className="space-y-4">
        {reviews.map((r) => (
          <ReviewItem
            key={r.id}
            content={r.content}
            userTags={r.userTags}
            createdAt={r.createdAt}
          />
        ))}
      </div>
    </section>
  );
}
