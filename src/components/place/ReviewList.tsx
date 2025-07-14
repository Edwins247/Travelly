'use client';
import React, { useEffect, useState } from 'react';
import { getReviewsByPlace } from '@/services/reviews';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';
import { Review } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Tag, TrendingUp } from 'lucide-react';

export function ReviewList({ placeId }: { placeId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getReviewsByPlace(placeId).then(setReviews);
  }, [placeId]);

  // 모든 리뷰의 태그를 수집하고 빈도수 계산
  const getPopularTags = () => {
    const tagCount: Record<string, number> = {};
    reviews.forEach(review => {
      review.userTags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));
  };

  const popularTags = getPopularTags();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>여행자 후기</CardTitle>
              <Badge variant="secondary">{reviews.length}</Badge>
            </div>
          </div>
        </CardHeader>

        {/* 인기 태그 */}
        {popularTags.length > 0 && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <h4 className="font-medium text-sm">실제 여행자들이 많이 언급한 키워드</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag, count }) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="gap-1 hover:bg-primary/10 transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <span className="text-xs text-muted-foreground">({count})</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 후기 작성 폼 */}
      <ReviewForm placeId={placeId} />

      {/* 후기 목록 */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>아직 후기가 없습니다.</p>
              <p className="text-sm">첫 번째 후기를 남겨보세요!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
            />
          ))
        )}
      </div>
    </div>
  );
}
