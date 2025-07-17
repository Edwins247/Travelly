import { useState } from 'react';
import { IMAGES } from '@/constants/common';
import { ERROR_MESSAGES } from '@/constants/messages';

export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > IMAGES.MAX_UPLOAD_COUNT) {
      alert(ERROR_MESSAGES.IMAGE_COUNT_EXCEEDED);
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

  const resetImages = () => {
    // 메모리 정리
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  return {
    selectedImages,
    imagePreviewUrls,
    handleImageChange,
    removeImage,
    resetImages
  };
}
