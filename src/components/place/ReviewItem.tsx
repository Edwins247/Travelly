'use client';
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Calendar, Tag, User } from 'lucide-react';
import { Review } from '@/types/review';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const { content, userTags, createdAt, userId } = review;

  // 사용자 ID에서 첫 글자 추출 (아바타용)
  const userInitial = userId.charAt(0).toUpperCase();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 헤더: 사용자 정보 + 날짜 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
                {userInitial}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>여행자</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(createdAt, 'yyyy.MM.dd')}</span>
            </div>
          </div>

          {/* 키워드 태그 */}
          {userTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">이 여행지는</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {userTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 후기 내용 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">후기</div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
