// src/components/contribute/ContributeForm.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { addPlace, updatePlace, uploadPlaceImage } from '@/services/places';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus, MapPin, Calendar, DollarSign, Tag, Image as ImageIcon } from 'lucide-react';

// 확장된 옵션 리스트
const domesticRegions = [
  { value: '서울', label: '서울', districts: ['중구', '강남구', '마포구', '종로구', '용산구'] },
  { value: '부산', label: '부산', districts: ['해운대구', '중구', '서구', '동래구'] },
  { value: '제주', label: '제주', districts: ['제주시', '서귀포시'] },
  { value: '경기', label: '경기', districts: ['수원시', '성남시', '고양시', '용인시'] },
  { value: '강원', label: '강원', districts: ['춘천시', '강릉시', '속초시', '원주시'] },
  { value: '경북', label: '경북', districts: ['경주시', '안동시', '포항시'] },
  { value: '경남', label: '경남', districts: ['통영시', '거제시', '진주시'] },
  { value: '전북', label: '전북', districts: ['전주시', '군산시'] },
  { value: '전남', label: '전남', districts: ['여수시', '순천시', '목포시'] },
  { value: '충북', label: '충북', districts: ['청주시', '충주시'] },
  { value: '충남', label: '충남', districts: ['천안시', '아산시', '공주시'] }
];

const overseasRegions = [
  { value: '일본', label: '일본', districts: ['도쿄', '오사카', '교토', '후쿠오카'] },
  { value: '중국', label: '중국', districts: ['베이징', '상하이', '시안', '청두'] },
  { value: '동남아', label: '동남아', districts: ['태국', '베트남', '싱가포르', '말레이시아'] },
  { value: '유럽', label: '유럽', districts: ['프랑스', '이탈리아', '스페인', '독일'] },
  { value: '미주', label: '미주', districts: ['미국', '캐나다', '멕시코'] },
  { value: '기타', label: '기타', districts: ['호주', '뉴질랜드', '인도', '기타'] }
];

const seasons = ['봄', '여름', '가을', '겨울'];
const budgets = ['저예산', '중간', '고급'];

const keywordCategories = {
  location: ['자연', '도시', '바다', '산', '강', '호수', '섬', '온천'],
  activity: ['등산', '트레킹', '수영', '서핑', '스키', '쇼핑', '카페투어', '맛집투어'],
  mood: ['힐링', '로맨틱', '데이트', '가족여행', '혼행', '친구여행', '액티비티', '휴식'],
  style: ['사진맛집', '인스타', '뷰맛집', '전통', '현대', '조용함', '활기참', '이색체험']
};

export interface PlaceFormValues {
  name: string;
  description?: string;
  imageFiles?: FileList;
  region: string;
  district?: string;
  regionType: '국내' | '해외';
  seasonTags: string[];
  budgetLevel: string;
  keywords: string[];
  customKeyword: string;
}

export function ContributeForm() {
  const { user } = useAuthStore();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

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
      seasonTags: [],
      customKeyword: ''
    },
  });

  const regionType = watch('regionType');
  const selectedRegion = watch('region');
  const selectedSeasons = watch('seasonTags');
  const selectedKeywords = watch('keywords');
  const customKeyword = watch('customKeyword');

  // 현재 지역 타입에 따른 지역 목록
  const currentRegions = regionType === '국내' ? domesticRegions : overseasRegions;
  const currentDistricts = currentRegions.find(r => r.value === selectedRegion)?.districts || [];

  // 이미지 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      alert('최대 5개의 이미지만 업로드할 수 있습니다.');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // 미리보기 URL 생성
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setImagePreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]); // 메모리 정리
      return prev.filter((_, i) => i !== index);
    });
  };

  // 계절 선택
  const toggleSeason = (season: string) => {
    const newSeasons = selectedSeasons.includes(season)
      ? selectedSeasons.filter(s => s !== season)
      : [...selectedSeasons, season];
    setValue('seasonTags', newSeasons);
  };

  // 키워드 선택
  const toggleKeyword = (keyword: string) => {
    const newKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    setValue('keywords', newKeywords);
  };

  // 커스텀 키워드 추가
  const addCustomKeyword = () => {
    if (customKeyword.trim() && !selectedKeywords.includes(customKeyword.trim())) {
      setValue('keywords', [...selectedKeywords, customKeyword.trim()]);
      setValue('customKeyword', '');
    }
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: PlaceFormValues) => {
    if (!user) {
      toast.error('로그인 필요', '로그인 후 이용해주세요.');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('이미지 필수', '최소 1개의 이미지를 업로드해주세요.');
      return;
    }

    if (data.seasonTags.length === 0) {
      toast.error('계절 선택 필수', '최소 1개의 계절을 선택해주세요.');
      return;
    }

    if (data.keywords.length === 0) {
      toast.error('키워드 선택 필수', '최소 1개의 키워드를 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1) 빈 문서 생성
      const placeId = await addPlace();
      setUploadProgress(20);

      // 2) 여러 이미지 업로드
      const imageUrls: string[] = [];
      const totalImages = selectedImages.length;

      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        try {
          const url = await uploadPlaceImage(file, placeId);
          imageUrls.push(url);
          setUploadProgress(20 + (60 * (i + 1)) / totalImages);
        } catch (error) {
          console.error(`Error uploading image ${i + 1}:`, error);
          toast.error('이미지 업로드 실패', `${file.name} 업로드에 실패했습니다.`);
          throw error;
        }
      }

      // 3) 문서 업데이트
      await updatePlace(placeId, {
        name: data.name,
        description: data.description,
        imageUrls,
        location: {
          region: data.region,
          district: data.district
        },
        regionType: data.regionType,
        seasonTags: data.seasonTags,
        budgetLevel: data.budgetLevel as '저예산' | '중간' | '고급',
        keywords: data.keywords,
        createdBy: user.uid,
      });

      setUploadProgress(100);
      toast.success('등록 완료', '여행지 제안이 성공적으로 등록되었습니다! 🎉');

      // 폼 초기화
      setSelectedImages([]);
      setImagePreviewUrls([]);
      // 폼 리셋
      setValue('name', '');
      setValue('description', '');
      setValue('region', '');
      setValue('district', '');
      setValue('keywords', []);
      setValue('seasonTags', []);
      setValue('customKeyword', '');

    } catch (e) {
      console.error('Form submission error:', e);
      toast.error('등록 실패', '여행지 제안 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 기본 정보 */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* 이미지 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              이미지 업로드 (최대 5개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 이미지 업로드 버튼 */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    클릭하여 이미지를 선택하세요
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG 파일 (최대 5개)
                  </p>
                </label>
              </div>

              {/* 이미지 미리보기 */}
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 여행 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              여행 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 추천 계절 */}
            <div>
              <Label>추천 계절* (복수 선택 가능)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {seasons.map((season) => (
                  <Badge
                    key={season}
                    variant={selectedSeasons.includes(season) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => toggleSeason(season)}
                  >
                    {season}
                  </Badge>
                ))}
              </div>
              {selectedSeasons.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">최소 1개 계절을 선택해주세요</p>
              )}
            </div>

            {/* 예산 수준 */}
            <div>
              <Label>예산 수준*</Label>
              <Select
                value={watch('budgetLevel')}
                onValueChange={(v) => setValue('budgetLevel', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="예산 수준 선택" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((budget) => (
                    <SelectItem key={budget} value={budget}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {budget}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budgetLevel && <p className="text-sm text-destructive">필수 선택입니다.</p>}
            </div>
          </CardContent>
        </Card>

        {/* 키워드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              키워드 태그
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 선택된 키워드 */}
            {selectedKeywords.length > 0 && (
              <div className="space-y-2">
                <Label>선택된 키워드</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg">
                  {selectedKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="default"
                      className="gap-1 cursor-pointer hover:bg-primary/80"
                      onClick={() => toggleKeyword(keyword)}
                    >
                      {keyword}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 키워드 카테고리별 선택 */}
            {Object.entries(keywordCategories).map(([category, keywords]) => (
              <div key={category} className="space-y-3">
                <Label className="text-sm font-medium">
                  {category === 'location' && '📍 장소 & 위치'}
                  {category === 'activity' && '🎯 액티비티'}
                  {category === 'mood' && '💭 분위기 & 테마'}
                  {category === 'style' && '🎨 스타일'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => toggleKeyword(keyword)}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            {/* 커스텀 키워드 추가 */}
            <div className="space-y-2">
              <Label>직접 키워드 추가</Label>
              <div className="flex gap-2">
                <Input
                  {...register('customKeyword')}
                  placeholder="새로운 키워드 입력..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomKeyword())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCustomKeyword}
                  disabled={!customKeyword.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedKeywords.length === 0 && (
              <p className="text-sm text-muted-foreground">최소 1개 키워드를 선택해주세요</p>
            )}
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isUploading}
          size="lg"
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              업로드 중... {uploadProgress}%
            </div>
          ) : isSubmitting ? (
            '등록 중...'
          ) : (
            '여행지 제안 등록'
          )}
        </Button>
      </form>
    </div>
  );
}
