import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { TIERS } from '@/lib/subscription/tiers'
import { getOliSystemInstructions, OLI_MODEL } from '@/lib/oli'

export const runtime = 'nodejs'

function extractAnswer(payload: any) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim()
  }

  for (const item of payload?.output ?? []) {
    if (item?.type !== 'message') continue
    for (const part of item?.content ?? []) {
      if (part?.type === 'output_text' && typeof part.text === 'string') return part.text.trim()
    }
  }

  return 'I could not complete that answer just now. Please try again.'
}

function extractSources(payload: any) {
  const seen = new Set<string>()
  const sources: { title: string; url: string }[] = []

  for (const item of payload?.output ?? []) {
    if (item?.type !== 'message') continue
    for (const part of item?.content ?? []) {
      for (const annotation of part?.annotations ?? []) {
        if (annotation?.type !== 'url_citation' || !annotation?.url || seen.has(annotation.url)) continue
        seen.add(annotation.url)
        sources.push({ title: annotation.title || annotation.url, url: annotation.url })
      }
    }
  }

  return sources.slice(0, 8)
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Oli is not connected to the AI service yet.' },
      { status: 503 },
    )
  }

  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Sign in to ask Oli questions or use web research.' },
      { status: 401 },
    )
  }

  const body = await request.json().catch(() => null)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const page = typeof body?.page === 'string' ? body.page.slice(0, 180) : ''

  if (!message || message.length > 4000) {
    return NextResponse.json({ error: 'Message must be between 1 and 4,000 characters.' }, { status: 400 })
  }

  const tier = await getUserTier(session.user.id).catch(() => TIERS.free)
  const instructions = `${getOliSystemInstructions(tier.id)}\n\nCurrent app page: ${page || 'unknown'}.`

  const upstream = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLI_MODEL,
      store: false,
      reasoning: { effort: 'low' },
      text: { verbosity: 'low' },
      instructions,
      input: message,
      tools: [
        {
          type: 'web_search_preview',
          search_context_size: 'low',
        },
      ],
      tool_choice: 'auto',
      include: ['web_search_call.action.sources'],
      max_output_tokens: 1400,
    }),
  })

  const payload = await upstream.json().catch(() => null)
  if (!upstream.ok) {
    console.error('Oli upstream error', upstream.status, payload?.error?.code || 'unknown')
    return NextResponse.json({ error: 'Oli could not answer that right now.' }, { status: 502 })
  }

  const searchedWeb = Array.isArray(payload?.output)
    ? payload.output.some((item: any) => item?.type === 'web_search_call')
    : false

  return NextResponse.json({
    answer: extractAnswer(payload),
    sources: extractSources(payload),
    searchedWeb,
    tier: tier.id,
  })
}
