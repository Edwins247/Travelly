import type { Timestamp } from 'firebase/firestore';

export interface Place {
  id: string;
  name: string;
  description?: string;
  imageUrls: string[];
  location: {
    region: string;
    district?: string;
  };
  regionType: '국내' | '해외';
  seasonTags: string[];
  budgetLevel: '저예산' | '중간' | '고급';
  keywords: string[];
  createdBy: string;
  createdAt: Timestamp;
  stats: {
    likes: number;
    reviewCount: number;
  };
}

export interface PlaceDTO {
  id: string;
  name: string;
  description?: string;
  imageUrls: string[];
  location: {
    region: string;
    district?: string;
  };
  regionType: '국내' | '해외';
  seasonTags: string[];
  budgetLevel: '저예산' | '중간' | '고급';
  keywords: string[];
  createdBy: string;
  // 원시 문자열로 넘깁니다
  createdAt: string;
  stats: {
    likes: number;
    reviewCount: number;
  };
}

// 검색·리스트용으로 필드를 좁힐 때
export interface PlaceCardData {
  id: string;
  name: string;
  region: string;
  thumbnail: string;
  liked?: boolean;
}

export interface PlaceInput {
  name: string;
  description?: string;
  imageUrls?: string[];    
  location: { region: string; district?: string };
  regionType: '국내' | '해외';
  seasonTags: string[];
  budgetLevel: '저예산' | '중간' | '고급';
  keywords?: string[];
  createdBy: string;
}

export interface GetPlacesOptions {
  keyword?: string;
  region?: 'domestic' | 'abroad';
  season?: string;
  budget?: string;
}
