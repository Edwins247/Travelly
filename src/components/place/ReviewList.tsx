'use client';
import React, { useEffect, useState } from 'react';
import { getReviewsByPlace } from '@/services/reviews';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';
import { Review } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Tag, TrendingUp } from 'lucide-react';
import { ERROR_MESSAGES, LOADING_MESSAGES, EMPTY_MESSAGES, ACTION_MESSAGES } from '@/constants/messages';
import { UI } from '@/constants/common';

export function ReviewList({ placeId }: { placeId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReviewsByPlace(placeId);
        setReviews(data);
      } catch (e) {
        console.error('Error fetching reviews:', e);
        setError(ERROR_MESSAGES.REVIEWS_LOAD_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placeId]);

  // 재시도용 함수
  const retryFetchReviews = () => {
    setLoading(true);
    setError(null);

    getReviewsByPlace(placeId)
      .then(setReviews)
      .catch(() => setError(ERROR_MESSAGES.REVIEWS_LOAD_FAILED))
      .finally(() => setLoading(false));
  };

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
      .slice(0, UI.POPULAR_TAGS_LIMIT)
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
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p>{LOADING_MESSAGES.LOADING_REVIEWS}</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">{error}</p>
              <button
                onClick={retryFetchReviews}
                className="text-sm text-primary hover:underline"
              >
                {ACTION_MESSAGES.RETRY}
              </button>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{EMPTY_MESSAGES.NO_REVIEWS}</p>
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
