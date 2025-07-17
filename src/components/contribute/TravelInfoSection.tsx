'use client';

import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { PlaceFormValues } from '@/types/contribute';
import { seasons, budgets } from '@/constants/contribute';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign } from 'lucide-react';

interface TravelInfoSectionProps {
  setValue: UseFormSetValue<PlaceFormValues>;
  watch: UseFormWatch<PlaceFormValues>;
  errors: FieldErrors<PlaceFormValues>;
  selectedSeasons: string[];
  toggleSeason: (season: string) => void;
}

export function TravelInfoSection({ 
  setValue, 
  watch, 
  errors, 
  selectedSeasons, 
  toggleSeason 
}: TravelInfoSectionProps) {
  return (
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
  );
}
