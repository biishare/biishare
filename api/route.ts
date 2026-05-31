import { NextResponse } from 'next/server'

const views: Record<string, number> = {}

export async function POST(req: Request) {
  const { postId } = await req.json()

  if (!postId) {
    return NextResponse.json({ ok: false })
  }

  views[postId] = (views[postId] || 0) + 1

  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json(views)
}