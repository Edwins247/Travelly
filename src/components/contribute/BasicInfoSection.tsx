// src/components/contribute/BasicInfoSection.tsx
'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { PlaceFormValues } from '@/types/contribute';
import { domesticRegions, overseasRegions } from '@/constants/contribute';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface BasicInfoSectionProps {
  register: UseFormRegister<PlaceFormValues>;
  errors: FieldErrors<PlaceFormValues>;
  setValue: UseFormSetValue<PlaceFormValues>;
  watch: UseFormWatch<PlaceFormValues>;
}

export function BasicInfoSection({ register, errors, setValue, watch }: BasicInfoSectionProps) {
  const regionType = watch('regionType');
  const selectedRegion = watch('region');

  // 현재 지역 타입에 따른 지역 목록
  const currentRegions = regionType === '국내' ? domesticRegions : overseasRegions;
  const currentDistricts = currentRegions.find(r => r.value === selectedRegion)?.districts || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          기본 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 여행지 이름 */}
        <div>
          <Label htmlFor="name">여행지 이름*</Label>
          <Input
            id="name"
            placeholder="예: 제주도 성산일출봉"
            {...register('name', { required: '필수 입력입니다.' })}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        {/* 설명 */}
        <div>
          <Label htmlFor="description">여행지 설명*</Label>
          <Textarea
            id="description"
            placeholder="이 여행지의 특징, 볼거리, 추천 이유 등을 자세히 설명해주세요..."
            {...register('description', { required: '필수 입력입니다.' })}
            rows={4}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        {/* 지역 정보 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label>국내/해외*</Label>
            <Select
              value={regionType}
              onValueChange={(v) => {
                setValue('regionType', v as '국내' | '해외');
                setValue('region', ''); // 지역 타입 변경 시 지역 초기화
                setValue('district', '');
              }}
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

          <div>
            <Label>지역*</Label>
            <Select
              value={selectedRegion}
              onValueChange={(v) => {
                setValue('region', v);
                setValue('district', ''); // 지역 변경 시 세부지역 초기화
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="지역 선택" />
              </SelectTrigger>
              <SelectContent>
                {currentRegions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.region && <p className="text-sm text-destructive">필수 선택입니다.</p>}
          </div>

          <div>
            <Label>세부 지역</Label>
            <Select
              value={watch('district')}
              onValueChange={(v) => setValue('district', v)}
              disabled={!selectedRegion}
            >
              <SelectTrigger>
                <SelectValue placeholder="세부 지역 선택" />
              </SelectTrigger>
              <SelectContent>
                {currentDistricts.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
