import assert from 'node:assert/strict'
import test from 'node:test'
import { createTranscriptParts, mergeTranscriptSegments, normalizeTranscript } from './reading/transcript.js'

test('normalizes transcript accents, punctuation and spacing', () => {
    assert.equal(normalizeTranscript('  El Le\u00f3n,   y el Rat\u00f3n! '), 'el leon y el raton')
})

test('uses partial transcript when it already includes confirmed text', () => {
    assert.equal(
        mergeTranscriptSegments('el leon', 'el leon y el raton'),
        'el leon y el raton'
    )
})

test('appends partial transcript when it is only the next fragment', () => {
    assert.equal(
        mergeTranscriptSegments('el leon', 'y el raton'),
        'el leon y el raton'
    )
})

test('removes overlap between confirmed suffix and partial prefix', () => {
    assert.equal(
        mergeTranscriptSegments('el leon y', 'y el raton'),
        'el leon y el raton'
    )
})

test('keeps confirmed transcript when partial is an older prefix', () => {
    assert.equal(
        mergeTranscriptSegments('el leon y el raton', 'el leon'),
        'el leon y el raton'
    )
})

test('matches overlap regardless of accents and punctuation', () => {
    assert.equal(
        mergeTranscriptSegments('El Le\u00f3n, y', 'y el rat\u00f3n'),
        'El Le\u00f3n, y el rat\u00f3n'
    )
})

test('separates confirmed words from unstable partial text', () => {
    assert.deepEqual(
        createTranscriptParts('el leon', 'el leon y el raton'),
        {
            displayText: 'el leon y el raton',
            stableText: 'el leon',
            stableWords: ['el', 'leon'],
            unstableText: 'y el raton',
        }
    )
})

test('marks all text as unstable when there is no confirmed transcript', () => {
    assert.deepEqual(
        createTranscriptParts('', 'el leon'),
        {
            displayText: 'el leon',
            stableText: '',
            stableWords: [],
            unstableText: 'el leon',
        }
    )
})
