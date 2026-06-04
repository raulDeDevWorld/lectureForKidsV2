const syllableRows = [
    ['b', ['ba', 'be', 'bi', 'bo', 'bu']],
    ['c', ['ca', 'ce', 'ci', 'co', 'cu']],
    ['d', ['da', 'de', 'di', 'do', 'du']],
    ['f', ['fa', 'fe', 'fi', 'fo', 'fu']],
    ['g', ['ga', 'ge', 'gi', 'go', 'gu']],
    ['h', ['ha', 'he', 'hi', 'ho', 'hu']],
    ['j', ['ja', 'je', 'ji', 'jo', 'ju']],
    ['k', ['ka', 'ke', 'ki', 'ko', 'ku']],
    ['l', ['la', 'le', 'li', 'lo', 'lu']],
    ['m', ['ma', 'me', 'mi', 'mo', 'mu']],
    ['n', ['na', 'ne', 'ni', 'no', 'nu']],
    ['\u00f1', ['\u00f1a', '\u00f1e', '\u00f1i', '\u00f1o', '\u00f1u']],
    ['p', ['pa', 'pe', 'pi', 'po', 'pu']],
    ['q', ['que', 'qui']],
    ['r', ['ra', 're', 'ri', 'ro', 'ru']],
    ['s', ['sa', 'se', 'si', 'so', 'su']],
    ['t', ['ta', 'te', 'ti', 'to', 'tu']],
    ['v', ['va', 've', 'vi', 'vo', 'vu']],
    ['w', ['wa', 'we', 'wi', 'wo', 'wu']],
    ['x', ['xa', 'xe', 'xi', 'xo', 'xu']],
    ['y', ['ya', 'ye', 'yi', 'yo', 'yu']],
    ['z', ['za', 'ze', 'zi', 'zo', 'zu']],
]

const syllableItems = syllableRows.flatMap(([letter, syllables]) => (
    syllables.map((syllable) => ({
        value: syllable,
        word: `Letra ${letter.toUpperCase()}`,
        example: syllable,
    }))
))

export const levelOneModules = [
    {
        id: 'vocales',
        title: 'Vocales',
        badge: 'Sonidos base',
        color: 'blue',
        prompt: 'Escucha y reconoce cada vocal.',
        items: [
            { value: 'A', word: 'abeja', example: 'A de abeja', imageUrl: '/aprender/vocales/a_abeja.webp' },
            { value: 'E', word: 'estrella', example: 'E de estrella', imageUrl: '/aprender/vocales/e_estrella.webp' },
            { value: 'I', word: 'isla', example: 'I de isla', imageUrl: '/aprender/vocales/i_isla.webp' },
            { value: 'O', word: 'oso', example: 'O de oso', imageUrl: '/aprender/vocales/o_oso.webp' },
            { value: 'U', word: 'uva', example: 'U de uva', imageUrl: '/aprender/vocales/u_uva.webp' },
        ],
        quiz: {
            question: 'Que vocal escuchas en uva?',
            answer: 'U',
            options: ['U', 'A', 'O'],
        },
    },
    {
        id: 'abecedario',
        title: 'Abecedario',
        badge: 'Letras',
        color: 'mint',
        prompt: 'Aprende letras con palabras faciles.',
        items: [
            { value: 'A', word: 'arbol', example: 'A de arbol' },
            { value: 'B', word: 'barco', example: 'B de barco' },
            { value: 'C', word: 'casa', example: 'C de casa' },
            { value: 'D', word: 'dado', example: 'D de dado' },
            { value: 'E', word: 'elefante', example: 'E de elefante' },
            { value: 'F', word: 'flor', example: 'F de flor' },
            { value: 'G', word: 'gato', example: 'G de gato' },
            { value: 'H', word: 'hoja', example: 'H de hoja' },
            { value: 'I', word: 'isla', example: 'I de isla' },
            { value: 'J', word: 'jarra', example: 'J de jarra' },
        ],
        quiz: {
            question: 'Con que letra empieza casa?',
            answer: 'C',
            options: ['C', 'S', 'K'],
        },
    },
    {
        id: 'numeros',
        title: 'Numeros',
        badge: 'En palabras',
        color: 'yellow',
        prompt: 'Relaciona cada numero con su palabra.',
        items: [
            { value: '1', word: 'uno', example: '1 se lee uno' },
            { value: '2', word: 'dos', example: '2 se lee dos' },
            { value: '3', word: 'tres', example: '3 se lee tres' },
            { value: '4', word: 'cuatro', example: '4 se lee cuatro' },
            { value: '5', word: 'cinco', example: '5 se lee cinco' },
            { value: '6', word: 'seis', example: '6 se lee seis' },
            { value: '7', word: 'siete', example: '7 se lee siete' },
            { value: '8', word: 'ocho', example: '8 se lee ocho' },
            { value: '9', word: 'nueve', example: '9 se lee nueve' },
            { value: '10', word: 'diez', example: '10 se lee diez' },
        ],
        quiz: {
            question: 'Como se escribe 4?',
            answer: 'cuatro',
            options: ['cuatro', 'siete', 'dos'],
        },
    },
    {
        id: 'silabas',
        title: 'Silabas',
        badge: 'Primeras uniones',
        color: 'peach',
        prompt: 'Practica las uniones de cada consonante con las vocales.',
        items: syllableItems,
        quiz: {
            question: 'Que silaba completa pa-to?',
            answer: 'pa',
            options: ['pa', 'me', 'su'],
        },
    },
]

export function getLevelOneModuleById(moduleId) {
    return levelOneModules.find((module) => module.id === moduleId) || null
}
