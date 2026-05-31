import { PostDTO } from "./post";

export type FeedBlock =
  | {
      type: 'content'
      items: PostDTO[]
    }
  | {
      type: 'shorts'
      area?: string
      page: number
    }
