export interface PlaceFormValues {
  name: string;
  description?: string;
  imageFiles?: FileList;
  region: string;
  district?: string;
  regionType: '국내' | '해외';
  seasonTags: string[];
  budgetLevel: string;
  keywords: string[];
  customKeyword: string;
}

export interface RegionInfo {
  value: string;
  label: string;
  districts: string[];
}

export interface KeywordCategories {
  location: string[];
  activity: string[];
  mood: string[];
  style: string[];
}
