export interface Collection {
  id: string;
  name: string;
  description?: string;
  authorId: string;
  quizIds: string[];
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CollectionPage {
  collections: Collection[];
  total: number;
  page: number;
  pageSize: number;
}