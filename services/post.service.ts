import { api } from "../lib/axios";
import { PostDTO, PostFiltersResponse } from "../types/post";

/* ---------- POSTS ---------- */

export type GetPostsParams = {
  subjectId?: string;
  level?: string;
  year?: number;
  contentType?: "video" | "document";
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
