import { api } from "../lib/axios";
import { PostDTO, PostFiltersResponse, SavedPostsResponse } from "../types/post";

/* ---------- POSTS ---------- */

export type GetPostsParams = {
  subjectId?: string;
  level?: string;
  contentType?: "video" | "document";
  q?: string;
  page?: number;
  limit?: number;
};

export async function getPosts(params?: GetPostsParams) {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  );

  const response = await api.get("/posts", {
    params: cleanParams,
  });

  return response.data as {
    data: PostDTO[];
    page?: number;
    total?: number;
  };
}

export async function getPostById(id: string): Promise<PostDTO> {
  const response = await api.get(`/posts/${id}`);
  return response.data;
}

/* ---------- FILTERS ---------- */

export async function getPostFilters(): Promise<PostFiltersResponse> {
  const response = await api.get<PostFiltersResponse>("/posts/filters");
  return response.data; // 🔥 ESSENCIAL
}
/* ---------- SAVED POSTS ---------- */

export type SavedPostsParams = {
  page?: number;
  limit?: number;
};

export async function getSavedPosts(params?: SavedPostsParams) {
  const response = await api.get<SavedPostsResponse>("/posts/saved", {
    params,
  });

  return response.data;
}

export async function getSavedPostStatus(postId: string) {
  const response = await api.get<{ saved: boolean }>(`/posts/${postId}/save`);
  return response.data;
}

export async function savePost(postId: string) {
  const response = await api.post<{ saved: boolean }>(`/posts/${postId}/save`);
  return response.data;
}

export async function removeSavedPost(postId: string) {
  const response = await api.delete<{ saved: boolean }>(`/posts/${postId}/save`);
  return response.data;
}
