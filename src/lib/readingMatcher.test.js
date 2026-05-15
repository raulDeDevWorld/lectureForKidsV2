import assert from 'node:assert/strict'
import test from 'node:test'
import {
    applySpeechEvent,
    createReadingSession,
    createSpeechEvent,
    getProgressRatio,
    getRenderableTokens,
    getWordMatchScore,
    normalizeWord,
    SPEECH_EVENT_TYPE,
    updateReadingProgress,
} from './readingMatcher.js'

test('normalizes accents and punctuation', () => {
    assert.equal(normalizeWord('Rat\u00f3n!'), 'raton')
    assert.equal(normalizeWord('\u00bfLe\u00f3n?'), 'leon')
})

test('preserves visual tokens while tracking word indexes', () => {
    const session = createReadingSession('El Leon, y el Raton')

    assert.equal(session.wordTokens.length, 5)
    assert.equal(session.visualTokens.some((token) => token.type === 'space'), true)
    assert.equal(session.wordTokens[1].raw, 'Leon,')
    assert.equal(session.wordTokens[1].normalized, 'leon')
})

test('accepts a complete phrase in one recognition event', () => {
    const initial = createReadingSession('El Leon y el Raton')
    const { session, events } = applySpeechEvent(initial, createSpeechEvent({
        text: 'el leon y el raton',
        type: SPEECH_EVENT_TYPE.FINAL,
    }))

    assert.equal(session.currentIndex, 5)
    assert.equal(session.isComplete, true)
    assert.equal(events.at(-1).type, 'SECTION_COMPLETED')
    assert.deepEqual(session.wordStates.map((state) => state.status), ['matched', 'matched', 'matched', 'matched', 'matched'])
})

test('does not regress when interim speech repeats previous words', () => {
    let session = createReadingSession('El Leon y el Raton')

    session = updateReadingProgress(session, 'el leon')
    session = updateReadingProgress(session, 'el leon y el')

    assert.equal(session.currentIndex, 4)
    assert.deepEqual(session.wordStates.slice(0, 4).map((state) => state.status), ['matched', 'matched', 'matched', 'matched'])
})

test('allows skipped words as assisted when the next strong match appears', () => {
    const initial = createReadingSession('El Leon y el Raton')
    const { session, events } = applySpeechEvent(initial, createSpeechEvent({ text: 'leon y raton' }))

    assert.equal(session.isComplete, true)
    assert.equal(session.wordStates[0].status, 'assisted')
    assert.deepEqual(session.wordStates.slice(1).map((state) => state.status), ['matched', 'matched', 'assisted', 'matched'])
    assert.ok(events.some((event) => event.type === 'WORD_ASSISTED'))
})

test('accepts small recognition differences with confidence metadata', () => {
    assert.ok(getWordMatchScore('perseverancia', 'perseveransia') >= 0.8)
    assert.equal(getWordMatchScore('raton', 'raton'), 1)
    assert.equal(getWordMatchScore('el', 'le'), 0)

    const session = updateReadingProgress(createReadingSession('perseverancia'), 'perseveransia')
    assert.equal(session.wordStates[0].status, 'matched')
    assert.equal(session.wordStates[0].source, 'fuzzy')
    assert.ok(session.wordStates[0].confidence >= 0.8)
})

test('reports progress ratio from matched and assisted words', () => {
    const session = updateReadingProgress(createReadingSession('uno dos tres cuatro'), 'uno tres cuatro')

    assert.equal(getProgressRatio(session), 1)
    assert.equal(session.wordStates[1].status, 'assisted')
})

test('returns renderable tokens with current word status', () => {
    const session = updateReadingProgress(createReadingSession('uno dos tres'), 'uno')
    const renderableTokens = getRenderableTokens(session)
    const wordTokens = renderableTokens.filter((token) => token.type === 'word')

    assert.equal(wordTokens[0].status, 'matched')
    assert.equal(wordTokens[1].status, 'current')
    assert.equal(wordTokens[2].status, 'pending')
})

test('emits missed events without advancing on unrelated speech', () => {
    const initial = createReadingSession('uno dos tres')
    const { session, events } = applySpeechEvent(initial, createSpeechEvent({ text: 'zapato azul' }))

    assert.equal(session.currentIndex, 0)
    assert.equal(session.missedStreak, 2)
    assert.deepEqual(events.map((event) => event.type), ['WORD_MISSED', 'WORD_MISSED'])
})
