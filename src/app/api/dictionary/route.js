import { NextResponse } from 'next/server'
import { getDefinition } from '@/features/dictionary/server/raeDictionary'

export async function POST(request) {
    const body = await request.json().catch(() => ({}))
    const word = String(body?.word || '').trim()

    if (!word) {
        return NextResponse.json({ error: 'Word is required' }, { status: 400 })
    }

    try {
        const definition = await getDefinition(word)
        const status = definition ? 200 : 404

        return NextResponse.json({ data: definition }, { status })
    } catch {
        return NextResponse.json({ error: 'Dictionary lookup failed' }, { status: 500 })
    }
}
