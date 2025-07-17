'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { PlaceFormValues } from '@/types/contribute';
import { keywordCategories } from '@/constants/contribute';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Tag } from 'lucide-react';

interface KeywordSectionProps {
  register: UseFormRegister<PlaceFormValues>;
  selectedKeywords: string[];
  customKeyword: string;
  toggleKeyword: (keyword: string) => void;
  addCustomKeyword: () => void;
}

export function KeywordSection({ 
  register, 
  selectedKeywords, 
  customKeyword, 
  toggleKeyword, 
  addCustomKeyword 
}: KeywordSectionProps) {
  return (
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
  );
}
