import { findBestMatch, findPartialLookaheadMatch, getPartialWordMatchScore } from './matcher.js'
import { SPEECH_EVENT_TYPE } from './speechEvents.js'
import { tokenizeReadingText } from './tokenizer.js'

export const WORD_STATUS = {
    PENDING: 'pending',
    CURRENT: 'current',
    HEARING: 'hearing',
    MATCHED: 'matched',
    ASSISTED: 'assisted',
}

export const READING_EVENT_TYPE = {
    WORD_MATCHED: 'WORD_MATCHED',
    WORD_HEARD: 'WORD_HEARD',
    WORD_ASSISTED: 'WORD_ASSISTED',
    WORD_MISSED: 'WORD_MISSED',
    SECTION_COMPLETED: 'SECTION_COMPLETED',
}

export function createReadingSession(text) {
    const { visualTokens, wordTokens } = tokenizeReadingText(text)

    return {
        text: String(text || ''),
        visualTokens,
        wordTokens,
        wordStates: wordTokens.map(() => ({
            status: WORD_STATUS.PENDING,
            confidence: 0,
            source: null,
            heard: '',
        })),
        acceptedCount: 0,
        currentIndex: 0,
        lastSpeechText: '',
        lastAcceptedWord: '',
        missedStreak: 0,
        lastEvents: [],
        isComplete: wordTokens.length === 0,
    }
}

export function applySpeechEvent(session, speechEvent) {
    if (!speechEvent?.words?.length || session.isComplete) {
        return {
            session: {
                ...session,
                lastSpeechText: speechEvent?.text || '',
                lastEvents: [],
            },
            events: [],
        }
    }

    let currentIndex = session.currentIndex
    let missedStreak = session.missedStreak
    let lastAcceptedWord = session.lastAcceptedWord
    let acceptedCount = session.acceptedCount ?? countAcceptedWords(session.wordStates)
    const wordStates = session.wordStates.map((state) => (
        state.status === WORD_STATUS.HEARING
            ? {
                ...state,
                status: WORD_STATUS.PENDING,
                confidence: 0,
                source: null,
                heard: '',
            }
            : { ...state }
    ))
    const events = []

    for (const heardToken of speechEvent.words) {
        if (currentIndex >= session.wordTokens.length) break

        const match = findBestMatch(session.wordTokens, currentIndex, heardToken.normalized)

        if (!match) {
            const expectedToken = session.wordTokens[currentIndex]
            const partialScore = speechEvent.type === SPEECH_EVENT_TYPE.INTERIM
                ? getPartialWordMatchScore(expectedToken?.normalized, heardToken.normalized)
                : 0

            if (partialScore > 0) {
                wordStates[currentIndex] = {
                    ...wordStates[currentIndex],
                    status: WORD_STATUS.HEARING,
                    confidence: partialScore,
                    source: 'partial-prefix',
                    heard: heardToken.raw,
                }
                missedStreak = 0
                events.push({
                    type: READING_EVENT_TYPE.WORD_HEARD,
                    index: currentIndex,
                    expected: expectedToken.raw,
                    heard: heardToken.raw,
                    confidence: partialScore,
                    source: 'partial-prefix',
                })
                continue
            }

            const partialLookahead = speechEvent.type === SPEECH_EVENT_TYPE.INTERIM
                ? findPartialLookaheadMatch(session.wordTokens, currentIndex, heardToken.normalized)
                : null

            if (partialLookahead) {
                wordStates[partialLookahead.index] = {
                    ...wordStates[partialLookahead.index],
                    status: WORD_STATUS.HEARING,
                    confidence: partialLookahead.score,
                    source: partialLookahead.source,
                    heard: heardToken.raw,
                }
                missedStreak = 0
                events.push({
                    type: READING_EVENT_TYPE.WORD_HEARD,
                    index: partialLookahead.index,
                    expected: session.wordTokens[partialLookahead.index].raw,
                    heard: heardToken.raw,
                    confidence: partialLookahead.score,
                    source: partialLookahead.source,
                })
                continue
            }

            missedStreak += 1
            events.push({
                type: READING_EVENT_TYPE.WORD_MISSED,
                expectedIndex: currentIndex,
                expected: session.wordTokens[currentIndex]?.raw || '',
                heard: heardToken.raw,
                streak: missedStreak,
            })
            continue
        }

        for (let index = currentIndex; index < match.index; index += 1) {
            if (wordStates[index].status === WORD_STATUS.PENDING) {
                acceptedCount += 1
                wordStates[index] = {
                    ...wordStates[index],
                    status: WORD_STATUS.ASSISTED,
                    confidence: 0.5,
                    source: 'lookahead-skip',
                    heard: '',
                }
                events.push({
                    type: READING_EVENT_TYPE.WORD_ASSISTED,
                    index,
                    expected: session.wordTokens[index].raw,
                    confidence: 0.5,
                    reason: 'lookahead-skip',
                })
            }
        }

        if (!isAcceptedStatus(wordStates[match.index]?.status)) {
            acceptedCount += 1
        }

        wordStates[match.index] = {
            status: WORD_STATUS.MATCHED,
            confidence: match.score,
            source: match.source,
            heard: heardToken.raw,
        }

        events.push({
            type: READING_EVENT_TYPE.WORD_MATCHED,
            index: match.index,
            expected: session.wordTokens[match.index].raw,
            heard: heardToken.raw,
            confidence: match.score,
            source: match.source,
        })

        currentIndex = match.index + 1
        missedStreak = 0
        lastAcceptedWord = heardToken.raw
    }

    const isComplete = currentIndex >= session.wordTokens.length
    if (isComplete && !session.isComplete) {
        events.push({
            type: READING_EVENT_TYPE.SECTION_COMPLETED,
            totalWords: session.wordTokens.length,
        })
    }

    const nextSession = {
        ...session,
        wordStates,
        acceptedCount,
        currentIndex,
        lastSpeechText: speechEvent.text,
        lastAcceptedWord,
        missedStreak,
        lastEvents: events,
        isComplete,
    }

    return { session: nextSession, events }
}

export function getProgressRatio(session) {
    if (!session.wordTokens.length) return 1

    const accepted = session.acceptedCount ?? countAcceptedWords(session.wordStates)

    return accepted / session.wordTokens.length
}

export function getWordStatus(session, index) {
    if (!session || index < 0) return WORD_STATUS.PENDING
    if (index === session.currentIndex && session.wordStates[index]?.status === WORD_STATUS.HEARING) {
        return WORD_STATUS.HEARING
    }
    if (index === session.currentIndex && !session.isComplete) return WORD_STATUS.CURRENT
    return session.wordStates[index]?.status || WORD_STATUS.PENDING
}

function isAcceptedStatus(status) {
    return status === WORD_STATUS.MATCHED || status === WORD_STATUS.ASSISTED
}

function countAcceptedWords(wordStates) {
    return wordStates.filter((state) => isAcceptedStatus(state.status)).length
}

export function getRenderableTokens(session) {
    return session.visualTokens.map((token) => {
        if (token.type !== 'word') return token

        const state = session.wordStates[token.wordIndex]
        const isCurrent = token.wordIndex === session.currentIndex && !session.isComplete

        return {
            ...token,
            status: isCurrent && state?.status !== WORD_STATUS.HEARING
                ? WORD_STATUS.CURRENT
                : state?.status || WORD_STATUS.PENDING,
            confidence: state?.confidence || 0,
            source: state?.source || null,
            heard: state?.heard || '',
        }
    })
}
