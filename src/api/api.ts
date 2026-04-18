import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Book, PageResponse, SliceResponse, Talk, Member, Schemas } from '../types';
import { API, MESSAGES, PAGINATION } from '../constants';

const apiClient = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  timeout: API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  response?: AxiosResponse;
  constructor(message: string, response?: AxiosResponse) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.response?.data?.message || error.message || MESSAGES.ERROR.API_REQUEST_FAILED;
    return Promise.reject(new ApiError(message, error.response));
  }
);

export async function getMe(): Promise<Member> {
  const response = await apiClient.get<Member>('/v1/auth/me');
  return response.data;
}

export type NaverLoginResponse = Schemas['NaverLoginResponse'];

export async function loginWithNaver(code: string, state: string): Promise<NaverLoginResponse> {
  const response = await apiClient.post<NaverLoginResponse>('/v1/auth/login/naver', { code, state });
  return response.data;
}

export async function signupWithNaver(nickname: string, registerToken: string): Promise<void> {
  await apiClient.post('/v1/auth/signup/naver', { nickname, registerToken });
}

export async function logout(): Promise<void> {
  await apiClient.post('/v1/auth/logout');
}

export async function reactivateAccount(token: string): Promise<void> {
  await apiClient.post('/v1/auth/reactivate', { token });
}

export async function searchBooks(keyword: string, page: number = 0): Promise<SliceResponse<Book>> {
  const response = await apiClient.get<SliceResponse<Book>>('/v1/books', {
    params: { keyword, page, sort: 'title,asc' }
  });
  return response.data;
}

export async function getBookDetails(bookId: string): Promise<Book> {
  const response = await apiClient.get<Book>(`/v1/books/${bookId}`);
  return response.data;
}

export async function getBooksByIds(bookIds: string[]): Promise<Book[]> {
  if (!bookIds || bookIds.length === 0) {
    return [];
  }
  const response = await apiClient.get<Book[]>('/v1/books', {
    params: { id: bookIds.join(',') }
  });
  return response.data;
}

export async function getTalks(bookId: string, page: number = 0): Promise<PageResponse<Talk>> {
  const response = await apiClient.get<PageResponse<Talk>>('/v1/talks', {
    params: { bookId, page, size: PAGINATION.TALK_LIST_SIZE, sort: 'createdAt,desc' }
  });
  return response.data;
}

export async function getRecommendedTalks(): Promise<Talk[]> {
  const response = await apiClient.get<Talk[]>('/v1/talks/recommend');
  return response.data;
}

export async function getMyTalks(page: number = 0): Promise<PageResponse<Talk>> {
  const response = await apiClient.get<PageResponse<Talk>>('/v1/me/talks', {
    params: { page, size: PAGINATION.TALK_LIST_SIZE, sort: 'createdAt,desc' }
  });
  return response.data;
}

export async function updateProfile(nickname: string): Promise<void> {
  await apiClient.put('/v1/me/profile', { nickname });
}

export async function deactivateAccount(): Promise<void> {
  await apiClient.delete('/v1/me');
}

export async function postTalk(bookId: string, content: string): Promise<Talk> {
  const now = new Date();
  now.setUTCMonth(now.getUTCMonth() + 12);
  const hiddenTimestamp = now.toISOString();

  const response = await apiClient.post<Talk>('/v1/talks', {
    bookId,
    content,
    hidden: hiddenTimestamp
  });
  return response.data;
}

export async function handleReaction(talkId: string, reactionType: 'LIKE' | 'SUPPORT', hasReacted: boolean): Promise<void> {
  if (hasReacted) {
    await apiClient.delete('/v1/reactions', {
      data: { type: reactionType, talkId: talkId }
    });
  } else {
    await apiClient.post('/v1/reactions', {
      type: reactionType,
      talkId: talkId
    });
  }
}

export async function sendVocMessage(content: string): Promise<void> {
  await apiClient.post('/v1/customer/messages', { content });
}

export async function updateTalk(talkId: string, content: string): Promise<void> {
  await apiClient.put(`/v1/talks/${talkId}`, { content });
}

export async function deleteTalk(talkId: string): Promise<void> {
  await apiClient.delete(`/v1/talks/${talkId}`);
}
