// src/types/place.ts
export interface PlaceCardData {
  id: string;
  name: string;
  region: string;         // ex) '강원도'
  thumbnail: string;      // image URL
  category: string;       // ex) '관광지' | '문화시설' …
  liked?: boolean;        // 찜 여부
}
