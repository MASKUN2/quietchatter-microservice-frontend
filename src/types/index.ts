import type { components } from './api-schema';

export type Schemas = components['schemas'];

export interface PageInfo {
  first: boolean;
  last: boolean;
  number: number;
  totalPages: number;
}

export interface SliceInfo {
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  empty: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}

export interface SliceResponse<T> extends SliceInfo {
  content: T[];
}

export type Book = components['schemas']['BookResponse'];

// Talk 타입은 생성된 스키마 중 TalkListResponse에서 단일 항목을 추출하여 정의합니다.
export type Talk = components['schemas']['TalkListResponse'][number] & {
  createdAt: string; // ISO String
  book?: {
    id: string;
    title: string;
    author: string;
    cover: string;
  };
};

export type Member = components['schemas']['AuthMeResponse'];
