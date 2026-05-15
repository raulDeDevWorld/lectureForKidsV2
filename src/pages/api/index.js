import { RAE } from 'rae-api'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const word = String(req.body?.word || '').trim()
    if (!word) {
        return res.status(400).json({ error: 'Word is required' })
    }

    try {
        const rae = new RAE()
        const search = await rae.searchWord(word)
        const firstResult = search.getRes()[0]

        if (!firstResult) {
            return res.status(404).json({ data: '' })
        }

        const result = await rae.fetchWord(firstResult.getId())
        const definition = result.getDefinitions()[0]?.getDefinition() || ''

        return res.status(200).json({ data: definition })
    } catch {
        return res.status(500).json({ error: 'Dictionary lookup failed' })
    }
}
