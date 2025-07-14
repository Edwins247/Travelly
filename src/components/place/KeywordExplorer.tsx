'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Tag, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KeywordExplorerProps {
  keywords: string[];
}

export default function KeywordExplorer({ keywords }: KeywordExplorerProps) {
  const router = useRouter();

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleExploreAll = () => {
    const allKeywords = keywords.join(' ');
    router.push(`/search?keyword=${encodeURIComponent(allKeywords)}`);
  };

  if (keywords.length === 0) return null;

  // 키워드를 카테고리별로 분류 (간단한 휴리스틱)
  const categorizeKeywords = (keywords: string[]) => {
    const categories = {
      location: [] as string[],
      activity: [] as string[],
      mood: [] as string[],
      other: [] as string[]
    };

    keywords.forEach(keyword => {
      if (keyword.includes('산') || keyword.includes('바다') || keyword.includes('해변') || keyword.includes('강') || keyword.includes('공원')) {
        categories.location.push(keyword);
      } else if (keyword.includes('등산') || keyword.includes('트레킹') || keyword.includes('수영') || keyword.includes('카페') || keyword.includes('쇼핑')) {
        categories.activity.push(keyword);
      } else if (keyword.includes('힐링') || keyword.includes('로맨틱') || keyword.includes('데이트') || keyword.includes('가족') || keyword.includes('휴식')) {
        categories.mood.push(keyword);
      } else {
        categories.other.push(keyword);
      }
    });

    return categories;
  };

  const categorizedKeywords = categorizeKeywords(keywords);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <CardTitle>여행 키워드로 탐색하기</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExploreAll}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            전체 탐색
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 주요 키워드 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <h4 className="font-medium text-sm">이 여행지의 핵심 키워드</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.slice(0, 6).map((keyword) => (
              <Badge
                key={keyword}
                variant="default"
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1"
                onClick={() => handleKeywordClick(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* 카테고리별 키워드 */}
        {categorizedKeywords.location.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">📍 장소 & 위치</h4>
            <div className="flex flex-wrap gap-2">
              {categorizedKeywords.location.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {categorizedKeywords.activity.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">🎯 액티비티</h4>
            <div className="flex flex-wrap gap-2">
              {categorizedKeywords.activity.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {categorizedKeywords.mood.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">💭 분위기 & 테마</h4>
            <div className="flex flex-wrap gap-2">
              {categorizedKeywords.mood.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {categorizedKeywords.other.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">🏷️ 기타</h4>
            <div className="flex flex-wrap gap-2">
              {categorizedKeywords.other.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 탐색 도움말 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>키워드를 클릭</strong>하면 비슷한 여행지를 찾을 수 있어요!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
