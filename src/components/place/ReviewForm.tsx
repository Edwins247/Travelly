'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { addReview } from '@/services/reviews';
import { useAuthStore } from '@/store/authStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const availableTags = ['힐링', '가족여행', '뷰맛집', '액티비티'];

interface FormValues {
  content: string;
  tags: string[];
}

export function ReviewForm({ placeId }: { placeId: string }) {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: { content: '', tags: [] } });

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return alert('로그인 후 작성해주세요');
    await addReview({
      placeId,
      content: data.content,
      userTags: data.tags,
      userId: user.uid,
    });
    window.location.reload(); // 또는 React Query/In-memory 업데이트
  });

  const selected = watch('tags');
  const toggleTag = (tag: string, checked: boolean) =>
    setValue(
      'tags',
      checked ? [...selected, tag] : selected.filter((t) => t !== tag)
    );

  return (
    <form onSubmit={onSubmit} className="space-y-4 border-t pt-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium">후기 내용</label>
        <Textarea {...register('content', { required: true })} rows={4} />
      </div>
      <fieldset className="space-y-1">
        <legend className="text-sm font-medium">키워드 태그</legend>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Checkbox
              key={tag}
              checked={selected.includes(tag)}
              onCheckedChange={(v) => toggleTag(tag, !!v)}
            >
              {tag}
            </Checkbox>
          ))}
        </div>
      </fieldset>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '등록 중…' : '후기 등록'}
      </Button>
    </form>
  );
}
