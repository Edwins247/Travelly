// src/components/contribute/ContributeForm.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { addPlace, PlaceInput } from '@/services/places';

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

const regions = ['서울', '경기', '제주', '부산', '해외'];
const seasons = ['봄', '여름', '가을', '겨울'];
const budgets = ['저예산', '중간', '고급'];
const keywordsOptions = ['가족여행', '힐링', '사진맛집', '반려동물 가능'];

export interface PlaceFormValues {
  name: string;
  description?: string;
  imageUrl?: string;
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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlaceFormValues>({
    defaultValues: {
      regionType: '국내',
      keywords: [],
    },
  });

  const kwSel = watch('keywords');
  const onKwTap = (kw: string, checked: boolean) =>
    setValue(
      'keywords',
      checked ? [...kwSel, kw] : kwSel.filter((x) => x !== kw),
    );

  const onSubmit = async (values: PlaceFormValues) => {
    if (!user) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    // PlaceInput 인터페이스에 맞게 변환
    const payload: PlaceInput = {
      name: values.name,
      description: values.description,
      imageUrl: values.imageUrl,
      location: { region: values.region },
      regionType: values.regionType,
      seasonTags: [values.seasonTag],
      budgetLevel: values.budgetLevel as '저예산' | '중간' | '고급',
      keywords: values.keywords,
      createdBy: user.uid,    
    };

    try {
      const newId = await addPlace(payload);
      alert(`여행지 제안이 등록되었습니다! (ID: ${newId})`);
    } catch (e) {
      console.error(e);
      alert('제안 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 여행지 이름 */}
      <div>
        <Label htmlFor="name">여행지 이름*</Label>
        <Input
          id="name"
          {...register('name', { required: '필수 입력입니다.' })}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* 설명 */}
      <div>
        <Label htmlFor="description">설명</Label>
        <Textarea id="description" {...register('description')} rows={3} />
      </div>

      {/* 이미지 URL */}
      <div>
        <Label htmlFor="imageUrl">대표 이미지 URL</Label>
        <Input
          id="imageUrl"
          placeholder="https://"
          {...register('imageUrl', {
            pattern: {
              value: /^https?:\/\//,
              message: '유효한 URL을 입력해주세요.',
            },
          })}
        />
        {errors.imageUrl && (
          <p className="text-sm text-destructive">
            {errors.imageUrl.message}
          </p>
        )}
      </div>

      {/* 지역 선택 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Region*</Label>
          <Select
            value={watch('region')}
            onValueChange={(v) => setValue('region', v)}
          >
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
          {errors.region && (
            <p className="text-sm text-destructive">필수 선택입니다.</p>
          )}
        </div>
        <div>
          <Label>국내/해외*</Label>
          <Select
            value={watch('regionType')}
            onValueChange={(v) =>
              setValue('regionType', v as '국내' | '해외')
            }
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

      {/* 계절/예산 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>추천 계절*</Label>
          <Select
            value={watch('seasonTag')}
            onValueChange={(v) => setValue('seasonTag', v)}
          >
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
          {errors.seasonTag && (
            <p className="text-sm text-destructive">필수 선택입니다.</p>
          )}
        </div>
        <div>
          <Label>예산대*</Label>
          <Select
            value={watch('budgetLevel')}
            onValueChange={(v) => setValue('budgetLevel', v)}
          >
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
          {errors.budgetLevel && (
            <p className="text-sm text-destructive">필수 선택입니다.</p>
          )}
        </div>
      </div>

      {/* 키워드 체크박스 */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">키워드*</legend>
        <div className="flex flex-wrap gap-2">
          {keywordsOptions.map((kw) => (
            <Checkbox
              key={kw}
              checked={kwSel.includes(kw)}
              onCheckedChange={(c) => onKwTap(kw, !!c)}
              className="rounded-full px-3 py-1 text-sm"
            >
              {kw}
            </Checkbox>
          ))}
        </div>
        {errors.keywords && (
          <p className="mt-1 text-sm text-destructive">
            최소 하나 이상 선택해주세요.
          </p>
        )}
      </fieldset>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? '등록 중…' : '제안 등록'}
      </Button>
    </form>
  );
}
