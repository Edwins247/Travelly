// src/components/contribute/ContributeForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addPlace, updatePlace, uploadPlaceImage } from '@/services/places';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';
import { startTrace, stopTrace } from '@/utils/performance';
import { placeAnalytics } from '@/utils/analytics';
import { usePageTracking, useConversionFunnel } from '@/hooks/usePageTracking';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useKeywordManagement } from '@/hooks/useKeywordManagement';
import { useSeasonManagement } from '@/hooks/useSeasonManagement';
import { PlaceFormValues } from '@/types/contribute';
import { BasicInfoSection } from './BasicInfoSection';
import { ImageUploadSection } from './ImageUploadSection';
import { TravelInfoSection } from './TravelInfoSection';
import { KeywordSection } from './KeywordSection';
import { Button } from '@/components/ui/button';



export function ContributeForm() {
  const { user } = useAuthStore();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // 페이지 추적 및 전환 퍼널
  usePageTracking('contribute', { user_authenticated: !!user });
  const { startFunnelStep, completeFunnelStep, abandonFunnelStep } = useConversionFunnel();

  // Analytics: 여행지 제안 시작 (컴포넌트 마운트 시)
  useEffect(() => {
    placeAnalytics.startContribution();
    startFunnelStep('contribution_start', {
      ...(user?.uid && { user_id: user.uid })
    });
  }, [user, startFunnelStep]);

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

  // 커스텀 훅들
  const imageUpload = useImageUpload();
  const keywordManagement = useKeywordManagement({ setValue, watch });
  const seasonManagement = useSeasonManagement({ setValue, watch });



  // 폼 제출 핸들러
  const onSubmit = async (data: PlaceFormValues) => {
    if (!user) {
      toast.error('로그인 필요', '로그인 후 이용해주세요.');
      return;
    }

    if (imageUpload.selectedImages.length === 0) {
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

    // 여행지 제안 성능 추적 시작
    const contributeTrace = startTrace('place_contribution');

    try {
      // 1) 빈 문서 생성
      const placeId = await addPlace();
      setUploadProgress(20);

      // 2) 여러 이미지 업로드
      const imageUrls: string[] = [];
      const totalImages = imageUpload.selectedImages.length;

      for (let i = 0; i < imageUpload.selectedImages.length; i++) {
        const file = imageUpload.selectedImages[i];
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

      // Analytics: 여행지 제안 완료
      placeAnalytics.completeContribution(
        placeId,
        data.region,
        data.regionType,
        data.keywords.length
      );

      // 전환 퍼널 완료
      completeFunnelStep('contribution_complete', {
        place_id: placeId,
        region: data.region,
        image_count: imageUpload.selectedImages.length,
      });

      // 성공 시 추적 종료
      stopTrace(contributeTrace);

      // 폼 초기화
      imageUpload.resetImages();
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

      // 전환 퍼널 중단
      abandonFunnelStep('contribution_abandon', {
        error: e instanceof Error ? e.message : 'Unknown error',
        step: 'submission',
      });

      // 에러 시 추적 종료
      stopTrace(contributeTrace);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 기본 정보 */}
        <BasicInfoSection
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />

        {/* 이미지 업로드 */}
        <ImageUploadSection
          selectedImages={imageUpload.selectedImages}
          imagePreviewUrls={imageUpload.imagePreviewUrls}
          handleImageChange={imageUpload.handleImageChange}
          removeImage={imageUpload.removeImage}
        />

        {/* 여행 정보 */}
        <TravelInfoSection
          setValue={setValue}
          watch={watch}
          errors={errors}
          selectedSeasons={seasonManagement.selectedSeasons}
          toggleSeason={seasonManagement.toggleSeason}
        />

        {/* 키워드 */}
        <KeywordSection
          register={register}
          selectedKeywords={keywordManagement.selectedKeywords}
          customKeyword={keywordManagement.customKeyword}
          toggleKeyword={keywordManagement.toggleKeyword}
          addCustomKeyword={keywordManagement.addCustomKeyword}
        />

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
