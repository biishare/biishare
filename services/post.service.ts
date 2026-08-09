import { api } from "../lib/axios";
import { CreatePostPayload, MediaKind, PostContentType, PostDTO, PostFiltersResponse, SavedPostsResponse, UpdatePostPayload } from "../types/post";


export type PublicationMediaUpload = {
  type: MediaKind
  url: string
  thumbnailUrl: string
  originalName: string
  title: string
  bytes: number
  totalPages?: number
}

export async function uploadPublicationMedia(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<{ data: PublicationMediaUpload }>('/posts/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data
}
/* ---------- POSTS ---------- */

export type GetPostsParams = {
  subjectId?: string;
  level?: string;
  contentType?: PostContentType;
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

export async function getMyPosts(params?: Pick<GetPostsParams, 'page' | 'limit'>) {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined
    )
  );

  const response = await api.get("/posts/mine", {
    params: cleanParams,
  });

  return response.data as {
    data: PostDTO[];
    page?: number;
    total?: number;
    totalPages?: number;
  };
}

export async function createPost(payload: CreatePostPayload) {
  const response = await api.post<{ message: string; data: PostDTO }>("/posts", payload);
  return response.data;
}

export async function updatePost(id: string, payload: UpdatePostPayload) {
  const response = await api.put<{ message: string; data: PostDTO }>(`/posts/${id}`, payload);
  return response.data;
}

export async function deletePost(id: string) {
  const response = await api.delete<{ message: string; data: PostDTO }>(`/posts/${id}`);
  return response.data;
}

export async function getPostById(id: string): Promise<PostDTO> {
  const response = await api.get(`/posts/${id}`);
  return response.data;
}

/* ---------- FILTERS ---------- */

export async function getPostFilters(): Promise<PostFiltersResponse> {
  const response = await api.get<PostFiltersResponse>("/posts/filters");
  return response.data;
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

