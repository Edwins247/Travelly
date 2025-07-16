'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addReview } from '@/services/reviews';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';
import { startTrace, stopTrace } from '@/utils/performance';
import { engagementAnalytics } from '@/utils/analytics';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PenTool, Tag, Plus, X } from 'lucide-react';
import { REVIEW_TAGS, REVIEW_DEFAULTS } from '@/constants/review';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages';
import { TIME } from '@/constants/common';

interface FormValues {
  content: string;
  tags: string[];
  customTag: string;
}

interface ReviewFormProps {
  placeId: string;
}

export function ReviewForm({ placeId }: ReviewFormProps) {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ defaultValues: REVIEW_DEFAULTS });

  const onSubmit = handleSubmit(async (data) => {
    if (!user) {
      toast.error('로그인 필요', '로그인 후 작성해주세요');
      return;
    }

    if (!data.content.trim()) {
      toast.error('내용 입력 필요', '후기 내용을 입력해주세요');
      return;
    }

    setSubmitError(null);

    // 리뷰 작성 성능 추적 시작
    const reviewTrace = startTrace('review_submission');

    try {
      // 커스텀 태그 추가
      const finalTags = data.customTag.trim()
        ? [...data.tags, data.customTag.trim()]
        : [...data.tags];

      await addReview({
        placeId,
        content: data.content.trim(),
        userTags: finalTags,
        userId: user.uid,
      });

      // 폼 초기화
      setValue('content', '');
      setValue('tags', []);
      setValue('customTag', '');
      setIsExpanded(false);

      // Analytics: 리뷰 작성 완료
      engagementAnalytics.completeReview(
        placeId,
        'Unknown Place', // place name은 상위에서 전달받아야 함
        finalTags.length,
        data.content.trim().length
      );

      // 성공 시 추적 종료
      stopTrace(reviewTrace);

      // 새로고침으로 리뷰 목록 업데이트
      setTimeout(() => {
        window.location.reload();
      }, TIME.RELOAD_DELAY);

    } catch (error) {
      console.error('Review submission error:', error);
      setSubmitError('후기 등록에 실패했습니다. 다시 시도해주세요.');
      toast.error('후기 등록 실패', '잠시 후 다시 시도해주세요.');

      // 에러 시 추적 종료
      stopTrace(reviewTrace);
    }
  });

  const selected = watch('tags');
  const customTag = watch('customTag');

  const toggleTag = (tag: string) => {
    const newTags = selected.includes(tag)
      ? selected.filter((t) => t !== tag)
      : [...selected, tag];
    setValue('tags', newTags);
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selected.includes(customTag.trim())) {
      setValue('tags', [...selected, customTag.trim()]);
      setValue('customTag', '');
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">후기를 작성하려면 로그인이 필요합니다</p>
          <Button variant="outline" onClick={() => {
            toast.info('로그인 필요', '후기 작성을 위해 로그인해주세요.');
          }}>
            로그인하기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-primary" />
          후기 작성하기
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* 후기 내용 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">이 여행지는 어떠셨나요?</label>
            <Textarea
              {...register('content', {
                required: '후기 내용을 입력해주세요',
                minLength: {
                  value: 10,
                  message: '최소 10자 이상 입력해주세요'
                }
              })}
              placeholder="여행지에 대한 솔직한 후기를 남겨주세요..."
              rows={4}
              className="resize-none"
              onFocus={() => {
                setIsExpanded(true);
                // Analytics: 리뷰 작성 시작
                engagementAnalytics.startReview(placeId);
              }}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          {/* 키워드 태그 섹션 */}
          {isExpanded && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <label className="text-sm font-medium">이 여행지를 표현하는 키워드를 선택해주세요</label>
                </div>

                {/* 선택된 태그 */}
                {selected.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg">
                    {selected.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="gap-1 cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 추천 태그 */}
                <div className="flex flex-wrap gap-2">
                  {REVIEW_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selected.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* 커스텀 태그 추가 */}
                <div className="flex gap-2">
                  <Input
                    {...register('customTag')}
                    placeholder="직접 키워드 추가..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addCustomTag}
                    disabled={!customTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex gap-2">
            {isExpanded && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsExpanded(false);
                  setSubmitError(null);
                }}
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  등록 중...
                </div>
              ) : (
                '후기 등록'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
