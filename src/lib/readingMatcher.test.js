import assert from 'node:assert/strict'
import test from 'node:test'
import {
    applySpeechEvent,
    createReadingSession,
    createSpeechEvent,
    getProgressRatio,
    getRenderableTokens,
    findPartialLookaheadMatch,
    getPartialWordMatchScore,
    getWordMatchScore,
    normalizeWord,
    SPEECH_EVENT_TYPE,
} from './readingMatcher.js'

function applyInterimSpeech(session, text) {
    return applySpeechEvent(session, createSpeechEvent({
        text,
        type: SPEECH_EVENT_TYPE.INTERIM,
    })).session
}

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

    session = applyInterimSpeech(session, 'el leon')
    session = applyInterimSpeech(session, 'el leon y el')

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

test('can align speech that starts a few words after the current word', () => {
    const initial = createReadingSession('En la selva un leon poderoso atrapo a un raton')
    const { session } = applySpeechEvent(initial, createSpeechEvent({ text: 'leon poderoso atrapo' }))

    assert.equal(session.currentIndex, 7)
    assert.deepEqual(
        session.wordStates.slice(0, 7).map((state) => state.status),
        ['assisted', 'assisted', 'assisted', 'assisted', 'matched', 'matched', 'matched']
    )
})

test('can align speech after recognition drops short starter words', () => {
    const initial = createReadingSession('En la selva un leon poderoso atrapo')
    const { session } = applySpeechEvent(initial, createSpeechEvent({ text: 'selva leon poderoso' }))

    assert.equal(session.currentIndex, 6)
    assert.deepEqual(
        session.wordStates.slice(0, 6).map((state) => state.status),
        ['assisted', 'assisted', 'matched', 'assisted', 'matched', 'matched']
    )
})

test('accepts small recognition differences with confidence metadata', () => {
    assert.ok(getWordMatchScore('perseverancia', 'perseveransia') >= 0.8)
    assert.equal(getWordMatchScore('raton', 'raton'), 1)
    assert.equal(getWordMatchScore('el', 'le'), 0)

    const session = applyInterimSpeech(createReadingSession('perseverancia'), 'perseveransia')
    assert.equal(session.wordStates[0].status, 'matched')
    assert.equal(session.wordStates[0].source, 'fuzzy')
    assert.ok(session.wordStates[0].confidence >= 0.8)
})

test('scores partial prefixes for low-latency current word feedback', () => {
    assert.equal(getPartialWordMatchScore('leon', 'l'), 0)
    assert.ok(getPartialWordMatchScore('leon', 'le') > 0)
    assert.ok(getPartialWordMatchScore('leon', 'leo') > getPartialWordMatchScore('leon', 'le'))
    assert.equal(getPartialWordMatchScore('leon', 'sol'), 0)
})

test('finds a partial lookahead match when short starter words are delayed', () => {
    const session = createReadingSession('El Leon duerme')
    const match = findPartialLookaheadMatch(session.wordTokens, 0, 'le')

    assert.deepEqual(match, {
        index: 1,
        score: 0.62,
        source: 'partial-lookahead',
    })
})

test('marks current word as hearing on a partial prefix without advancing progress', () => {
    const session = applyInterimSpeech(createReadingSession('leon duerme'), 'le')
    const wordTokens = getRenderableTokens(session).filter((token) => token.type === 'word')

    assert.equal(session.currentIndex, 0)
    assert.equal(getProgressRatio(session), 0)
    assert.equal(session.wordStates[0].status, 'hearing')
    assert.equal(wordTokens[0].status, 'hearing')
    assert.equal(wordTokens[1].status, 'pending')
})

test('marks upcoming word as hearing when interim starts after a short current word', () => {
    const session = applyInterimSpeech(createReadingSession('El Leon duerme'), 'le')
    const wordTokens = getRenderableTokens(session).filter((token) => token.type === 'word')

    assert.equal(session.currentIndex, 0)
    assert.equal(getProgressRatio(session), 0)
    assert.equal(session.wordStates[0].status, 'pending')
    assert.equal(session.wordStates[1].status, 'hearing')
    assert.deepEqual(wordTokens.map((token) => token.status), ['current', 'hearing', 'pending'])
})

test('confirms lookahead hearing when the full word arrives', () => {
    let session = applyInterimSpeech(createReadingSession('El Leon duerme'), 'le')
    session = applyInterimSpeech(session, 'leon')
    const wordTokens = getRenderableTokens(session).filter((token) => token.type === 'word')

    assert.equal(session.currentIndex, 2)
    assert.deepEqual(session.wordStates.slice(0, 2).map((state) => state.status), ['assisted', 'matched'])
    assert.deepEqual(wordTokens.map((token) => token.status), ['assisted', 'matched', 'current'])
})

test('confirms a hearing word when a full match arrives', () => {
    let session = applyInterimSpeech(createReadingSession('leon duerme'), 'le')
    session = applyInterimSpeech(session, 'leon')
    const wordTokens = getRenderableTokens(session).filter((token) => token.type === 'word')

    assert.equal(session.currentIndex, 1)
    assert.equal(session.wordStates[0].status, 'matched')
    assert.deepEqual(wordTokens.map((token) => token.status), ['matched', 'current'])
})

test('clears hearing state when the next interim no longer matches', () => {
    let session = applyInterimSpeech(createReadingSession('leon duerme'), 'le')
    session = applyInterimSpeech(session, 'zapato')
    const wordTokens = getRenderableTokens(session).filter((token) => token.type === 'word')

    assert.equal(session.currentIndex, 0)
    assert.equal(session.wordStates[0].status, 'pending')
    assert.equal(wordTokens[0].status, 'current')
    assert.equal(session.missedStreak, 1)
})

test('reports progress ratio from matched and assisted words', () => {
    const session = applyInterimSpeech(createReadingSession('uno dos tres cuatro'), 'uno tres cuatro')

    assert.equal(getProgressRatio(session), 1)
    assert.equal(session.wordStates[1].status, 'assisted')
})

test('returns renderable tokens with current word status', () => {
    const session = applyInterimSpeech(createReadingSession('uno dos tres'), 'uno')
    const renderableTokens = getRenderableTokens(session)
    const wordTokens = renderableTokens.filter((token) => token.type === 'word')

    assert.equal(wordTokens[0].status, 'matched')
    assert.equal(wordTokens[1].status, 'current')
    assert.equal(wordTokens[2].status, 'pending')
})

test('keeps matched words visible as speech advances', () => {
    let session = createReadingSession('uno dos tres cuatro')

    session = applyInterimSpeech(session, 'uno dos')
    let wordTokens = getRenderableTokens(session).filter((token) => token.type === 'word')

    assert.deepEqual(wordTokens.map((token) => token.status), ['matched', 'matched', 'current', 'pending'])

    session = applyInterimSpeech(session, 'tres')
    wordTokens = getRenderableTokens(session).filter((token) => token.type === 'word')

    assert.deepEqual(wordTokens.map((token) => token.status), ['matched', 'matched', 'matched', 'current'])
})

test('emits missed events without advancing on unrelated speech', () => {
    const initial = createReadingSession('uno dos tres')
    const { session, events } = applySpeechEvent(initial, createSpeechEvent({ text: 'zapato azul' }))

    assert.equal(session.currentIndex, 0)
    assert.equal(session.missedStreak, 2)
    assert.deepEqual(events.map((event) => event.type), ['WORD_MISSED', 'WORD_MISSED'])
})
