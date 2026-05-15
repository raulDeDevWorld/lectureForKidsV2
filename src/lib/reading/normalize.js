export function normalizeWord(word) {
    return String(word)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,:;'!?\u00a1\u00bf"()[\]{}]/g, '')
        .trim()
}
