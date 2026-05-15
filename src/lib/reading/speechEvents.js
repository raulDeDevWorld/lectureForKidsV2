import { tokenizeWords } from './tokenizer.js'

export const SPEECH_EVENT_TYPE = {
    INTERIM: 'SPEECH_INTERIM',
    FINAL: 'SPEECH_FINAL',
}

export function createSpeechEvent({ text, type = SPEECH_EVENT_TYPE.INTERIM, sequence = 0 }) {
    const cleanText = String(text || '').replace(/\s+/g, ' ').trim()

    return {
        type,
        sequence,
        text: cleanText,
        words: tokenizeWords(cleanText),
        createdAt: Date.now(),
    }
}
