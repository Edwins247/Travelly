'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addReview } from '@/services/reviews';
import { useAuthStore } from '@/store/authStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PenTool, Tag, Plus, X } from 'lucide-react';


const availableTags = [
  '힐링', '가족여행', '뷰맛집', '액티비티', '데이트', '혼행',
  '사진맛집', '인스타', '자연', '도시', '전통', '현대',
  '조용함', '활기참', '저렴함', '고급스러움'
];

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,

    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: { content: '', tags: [], customTag: '' } });

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return alert('로그인 후 작성해주세요');

    // 커스텀 태그 추가
    const finalTags = data.customTag.trim()
      ? [...data.tags, data.customTag.trim()]
      : [...data.tags];

    await addReview({
      placeId,
      content: data.content,
      userTags: finalTags,
      userId: user.uid,
    });

    // 새로고침으로 리뷰 목록 업데이트
    window.location.reload();
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
          <Button variant="outline" onClick={() => window.location.href = '/login'}>
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
              {...register('content', { required: true })}
              placeholder="여행지에 대한 솔직한 후기를 남겨주세요..."
              rows={4}
              className="resize-none"
              onFocus={() => setIsExpanded(true)}
            />
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
                  {availableTags.map((tag) => (
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

          {/* 제출 버튼 */}
          <div className="flex gap-2">
            {isExpanded && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? '등록 중...' : '후기 등록'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
