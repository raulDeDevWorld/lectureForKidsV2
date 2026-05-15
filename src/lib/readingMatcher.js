import { getWordMatchScore, levenshteinDistance } from './reading/matcher.js'
import {
    applySpeechEvent,
    createReadingSession,
    getProgressRatio,
    getRenderableTokens,
    getWordStatus,
} from './reading/reducer.js'
import { createSpeechEvent, SPEECH_EVENT_TYPE } from './reading/speechEvents.js'
import { tokenizeWords } from './reading/tokenizer.js'
import { normalizeWord } from './reading/normalize.js'

export {
    applySpeechEvent,
    createReadingSession,
    createSpeechEvent,
    getProgressRatio,
    getRenderableTokens,
    getWordMatchScore,
    getWordStatus,
    levenshteinDistance,
    normalizeWord,
    SPEECH_EVENT_TYPE,
    tokenizeWords,
}

export function createReadingProgress(text) {
    return createReadingSession(text)
}

export function updateReadingProgress(progress, speechText) {
    return applySpeechEvent(
        progress,
        createSpeechEvent({ text: speechText, type: SPEECH_EVENT_TYPE.INTERIM })
    ).session
}
