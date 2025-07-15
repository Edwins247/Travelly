'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X, ImageIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { engagementAnalytics } from '@/utils/analytics';

interface ImageGalleryProps {
  images: string[];
  placeName: string;
  placeId?: string; // Analytics용
}

export default function ImageGallery({ images, placeName, placeId }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);

    // Analytics: 이미지 네비게이션
    if (placeId) {
      engagementAnalytics.imageGalleryInteraction(placeId, 'navigate');
    }
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    // Analytics: 이미지 네비게이션
    if (placeId) {
      engagementAnalytics.imageGalleryInteraction(placeId, 'navigate');
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  if (images.length === 0) {
    return (
      <div className="relative h-96 bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">이미지가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative h-96 rounded-xl overflow-hidden group bg-muted">
        {imageErrors.has(currentIndex) ? (
          <div className="flex h-full w-full items-center justify-center flex-col gap-2 text-muted-foreground">
            <AlertTriangle className="h-12 w-12" />
            <p className="text-sm">이미지를 불러올 수 없습니다</p>
          </div>
        ) : (
          <Image
            src={images[currentIndex]}
            alt={`${placeName} - ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => handleImageError(currentIndex)}
            unoptimized
          />
        )}
        
        {/* 이미지 네비게이션 */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* 풀스크린 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white"
          onClick={() => {
            setIsFullscreen(true);

            // Analytics: 풀스크린 보기
            if (placeId) {
              engagementAnalytics.imageGalleryInteraction(placeId, 'fullscreen');
            }
          }}
        >
          <Expand className="h-5 w-5" />
        </Button>

        {/* 이미지 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => {
                  setCurrentIndex(index);

                  // Analytics: 이미지 인디케이터 클릭
                  if (placeId) {
                    engagementAnalytics.imageGalleryInteraction(placeId, 'view');
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 썸네일 그리드 */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              {imageErrors.has(index) ? (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <Image
                  src={image}
                  alt={`${placeName} 썸네일 ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(index)}
                  unoptimized
                />
              )}
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 풀스크린 모달 */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl w-full h-full p-0 bg-black/95">
          <VisuallyHidden>
            <DialogTitle>{placeName} 이미지 갤러리</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* 풀스크린 이미지 */}
            <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
              <Image
                src={images[currentIndex]}
                alt={`${placeName} - ${currentIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* 풀스크린 네비게이션 */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* 풀스크린 인디케이터 */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}

            {/* 이미지 정보 */}
            <div className="absolute bottom-8 right-8 text-white bg-black/50 px-3 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
