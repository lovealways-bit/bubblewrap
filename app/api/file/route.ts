import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { db } from '@/lib/db'
import { customDeck } from '@/lib/db/schema'
import { getSession } from '@/lib/session'
import { and, eq } from 'drizzle-orm'

// Serves private custom-deck art only to the authenticated owner of the deck.
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
  }

  // Expected shape: custom-decks/{deckId}/{card}.png
  const match = /^custom-decks\/([^/]+)\//.exec(pathname)
  if (!match) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const deckId = match[1]

  const rows = await db
    .select({ id: customDeck.id })
    .from(customDeck)
    .where(and(eq(customDeck.id, deckId), eq(customDeck.userId, session.user.id)))
    .limit(1)
  if (!rows[0]) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const result = await get(pathname, {
      access: 'private',
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
    })

    if (!result) {
      return new NextResponse('Not found', { status: 404 })
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          'Cache-Control': 'private, no-cache',
        },
      })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        ETag: result.blob.etag,
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
