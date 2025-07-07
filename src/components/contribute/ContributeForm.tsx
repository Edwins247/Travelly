'use client';

import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { addPlace } from '@/services/places';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

/* ---------- 옵션 목록 ---------- */
const regions = ['서울', '경기', '제주', '부산', '해외'];
const seasons = ['봄', '여름', '가을', '겨울'];
const budgets = ['저예산', '중간', '고급'];
const keywords = ['가족여행', '힐링', '사진맛집', '반려동물 가능'];

export interface PlaceFormValues {
  name: string;
  description: string;
  imageUrl: string;
  region: string;
  regionType: '국내' | '해외';
  seasonTag: string;
  budgetLevel: string;
  keywords: string[];
}

export function ContributeForm() {
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlaceFormValues>({
    defaultValues: {
      regionType: '국내',
      keywords: [],
    },
  });

  /* ------------ 체크박스 상태 ------------ */
  const kwSel = watch('keywords');
  const onKwTap = (k: string, checked: boolean) =>
    setValue('keywords', checked ? [...kwSel, k] : kwSel.filter((v) => v !== k));

  /* ------------ 제출 ------------ */
  const onSubmit = async (data: PlaceFormValues) => {
    if (!user) return alert('로그인 후 이용하세요!');
    try {
      await addPlace({ ...data, createdBy: user.uid });
      alert('제안이 등록되었습니다 🎉');
    } catch (e) {
      console.error(e);
      alert('저장 중 오류가 발생했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* 여행지 이름 */}
        <div className="space-y-2">
          <Label htmlFor="place-name">여행지 이름*</Label>
          <Input id="place-name" {...register('name', { required: '필수 입력' })} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <Label htmlFor="place-desc">설명</Label>
          <Textarea id="place-desc" rows={3} {...register('description')} />
        </div>

        {/* 대표 이미지 URL */}
        <div className="space-y-2">
          <Label htmlFor="place-img">대표 이미지 URL</Label>
          <Input
            id="place-img"
            placeholder="https://"
            {...register('imageUrl', {
              pattern: { value: /^https?:\/\//, message: 'URL 형식이 아닙니다' },
            })}
          />
          {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
        </div>
      </div>
      {/* --- 지역 / 국내·해외 --- */}
      <div className="grid grid-cols-2 gap-4">
        {/* 지역 */}
        <div>
          <Label>Region*</Label>
          <Select value={watch('region')} onValueChange={(v) => setValue('region', v)}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && <p className="text-sm text-destructive">필수</p>}
        </div>

        {/* 국내/해외 */}
        <div>
          <Label>국내 / 해외*</Label>
          <Select
            value={watch('regionType')}
            onValueChange={(v) => setValue('regionType', v as '국내' | '해외')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="국내">국내</SelectItem>
              <SelectItem value="해외">해외</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* --- 계절 / 예산 --- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>추천 계절*</Label>
          <Select value={watch('seasonTag')} onValueChange={(v) => setValue('seasonTag', v)}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.seasonTag && <p className="text-sm text-destructive">필수</p>}
        </div>

        <div>
          <Label>예산대*</Label>
          <Select value={watch('budgetLevel')} onValueChange={(v) => setValue('budgetLevel', v)}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetLevel && <p className="text-sm text-destructive">필수</p>}
        </div>
      </div>
      {/* --- 키워드 (다중 선택) --- */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">키워드*</legend>
        <div className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <Checkbox
              key={k}
              checked={kwSel.includes(k)}
              onCheckedChange={(c) => onKwTap(k, !!c)}
              className="rounded-full px-3 py-1 text-sm"
            >
              {k}
            </Checkbox>
          ))}
        </div>
        {errors.keywords && <p className="mt-1 text-sm text-destructive">최소 1개 선택</p>}
      </fieldset>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? '등록 중…' : '제안 등록'}
      </Button>
    </form>
  );
}
