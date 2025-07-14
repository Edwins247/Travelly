'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, DollarSign, Users, Heart } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface PlaceOverviewProps {
  placeId: string;
  name: string;
  description?: string;
  regionType: '국내' | '해외';
  location: { region: string; district?: string };
  seasonTags: string[];
  budgetLevel: '저예산' | '중간' | '고급';
  stats: { likes: number; reviewCount: number };
}

export default function PlaceOverview({
  placeId,
  name,
  description,
  regionType,
  location,
  seasonTags,
  budgetLevel,
  stats,
}: PlaceOverviewProps) {
  // 실시간 likes 수 추적
  const [currentLikes, setCurrentLikes] = useState(stats.likes);

  useEffect(() => {
    const placeRef = doc(db, 'places', placeId);
    const unsubscribe = onSnapshot(placeRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.stats?.likes !== undefined) {
          setCurrentLikes(data.stats.likes);
        }
      }
    });

    return () => unsubscribe();
  }, [placeId]);
  const getBudgetColor = (level: string) => {
    switch (level) {
      case '저예산': return 'bg-green-100 text-green-800';
      case '중간': return 'bg-yellow-100 text-yellow-800';
      case '고급': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case '봄': return 'bg-pink-100 text-pink-800';
      case '여름': return 'bg-blue-100 text-blue-800';
      case '가을': return 'bg-orange-100 text-orange-800';
      case '겨울': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 제목과 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{location.region}{location.district && `, ${location.district}`}</span>
              <Badge variant="outline" className="ml-2">{regionType}</Badge>
            </div>
          </div>
          
          {/* 통계 정보 */}
          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{currentLikes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{stats.reviewCount} 리뷰</span>
            </div>
          </div>
        </div>

        {/* 설명 */}
        {description && (
          <p className="text-gray-700 leading-relaxed">{description}</p>
        )}
      </div>

      {/* 여행 정보 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 계절 정보 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">추천 계절</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {seasonTags.map((season) => (
                <Badge 
                  key={season} 
                  className={getSeasonColor(season)}
                  variant="secondary"
                >
                  {season}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 예산 정보 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">예산 수준</h3>
            </div>
            <Badge 
              className={getBudgetColor(budgetLevel)}
              variant="secondary"
            >
              {budgetLevel}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              {budgetLevel === '저예산' && '경제적인 여행을 원하는 분들에게 추천'}
              {budgetLevel === '중간' && '적당한 예산으로 편안한 여행'}
              {budgetLevel === '고급' && '프리미엄 경험을 원하는 분들에게 추천'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
