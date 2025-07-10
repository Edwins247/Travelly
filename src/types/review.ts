export interface Review {
  id: string;
  placeId: string;
  content: string;
  userTags: string[];
  userId: string;
  createdAt: Date;
}

export interface ReviewInput {
  placeId: string;
  content: string;
  userTags: string[];
  userId: string;
}