'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { IMAGES } from '@/constants/common';

interface ImageUploadSectionProps {
  selectedImages: File[];
  imagePreviewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export function ImageUploadSection({  
  imagePreviewUrls, 
  handleImageChange, 
  removeImage 
}: ImageUploadSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          이미지 업로드 (최대 {IMAGES.MAX_UPLOAD_COUNT}개)
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
                JPG, PNG 파일 (최대 {IMAGES.MAX_UPLOAD_COUNT}개)
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
  );
}
