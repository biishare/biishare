import { PostDTO } from "../types/post"
import { FeedBlock } from '../types/feed'

const CONTENT_BLOCK_SIZE = 6
const SHORTS_EVERY_N_BLOCKS = 2

export function buildFeed(
  posts: PostDTO[],
  subjectId?: string
): FeedBlock[] {
  const blocks: FeedBlock[] = []
  let shortsPage = 1
  let blockCount = 0

  for (let i = 0; i < posts.length; i += CONTENT_BLOCK_SIZE) {
    blocks.push({
      type: 'content',
      items: posts.slice(i, i + CONTENT_BLOCK_SIZE),
    })

    blockCount++

    if (blockCount % SHORTS_EVERY_N_BLOCKS === 0) {
      blocks.push({
        type: 'shorts',
        area: subjectId,
        page: shortsPage++,
      })
    }
  }

  return blocks
}
