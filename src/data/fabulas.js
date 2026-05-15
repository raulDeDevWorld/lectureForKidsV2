export const fabulas = [
    {
        id: '8f393cf0-5598-429f-yb7a-0c1279725691',
        title: 'El León y el Ratón',
        slug: 'el-leon-y-el-raton',
        content: [
            'Un día, un león dormía bajo la sombra de un árbol. Un pequeño ratón pasó corriendo y, sin querer, despertó al gran rey de la selva.',
            'El león lo atrapó con su enorme pata, pero el ratón le pidió una oportunidad. Prometió que algún día podría ayudarlo.',
            'El león sonrió y lo dejó ir. Tiempo después, el león cayó en una red de cazadores. El ratón escuchó sus rugidos, corrió hasta él y mordió la cuerda hasta liberarlo.',
        ],
        teaching: 'La bondad nunca es pequeña. Todos podemos ayudar, sin importar nuestro tamaño.',
        category: 'Bondad',
        ageRange: '4-8',
        readingTime: '4 min',
        imageUrl: '/stories/el-leon-y-el-raton.svg',
        color: 'blue',
    },
    {
        id: '4fd8700c-0595-444b-yc1b-b67ca6da8118',
        title: 'La Tortuga y la Liebre',
        slug: 'la-tortuga-y-la-liebre',
        content: [
            'La liebre corría muy rápido y se burlaba de la tortuga porque caminaba despacio.',
            'Un día hicieron una carrera. La liebre avanzó velozmente y decidió dormir un rato, segura de que ganaría.',
            'La tortuga siguió paso a paso, sin detenerse. Cuando la liebre despertó, la tortuga ya estaba llegando a la meta.',
        ],
        teaching: 'La constancia y la paciencia ayudan a lograr grandes metas.',
        category: 'Perseverancia',
        ageRange: '4-8',
        readingTime: '3 min',
        imageUrl: '/stories/la-tortuga-y-la-liebre.svg',
        color: 'mint',
    },
    {
        id: 'pajarito-curioso',
        title: 'El Pajarito Curioso',
        slug: 'el-pajarito-curioso',
        content: [
            'Pipo era un pajarito que hacía muchas preguntas. Quería saber por qué brillaba el sol y por qué las nubes cambiaban de forma.',
            'Su mamá le dijo que la curiosidad era una gran amiga si también aprendía a escuchar.',
            'Desde ese día, Pipo preguntó, observó y compartió lo que aprendía con todos sus amigos del bosque.',
        ],
        teaching: 'Preguntar y escuchar nos ayuda a aprender mejor.',
        category: 'Aprender',
        ageRange: '4-8',
        readingTime: '3 min',
        imageUrl: '/stories/el-pajarito-curioso.svg',
        color: 'peach',
    },
    {
        id: 'suenos-de-estrellas',
        title: 'Sueños de Estrellas',
        slug: 'suenos-de-estrellas',
        content: [
            'Luna miraba el cielo cada noche y soñaba con tocar una estrella.',
            'Construyó una escalera de dibujos, canciones y buenos deseos. Cada escalón la hacía sentirse más valiente.',
            'No llegó al cielo, pero descubrió algo especial: cuando compartía sus sueños, su habitación brillaba como una estrella.',
        ],
        teaching: 'Los sueños crecen cuando creemos en ellos y los compartimos.',
        category: 'Imaginación',
        ageRange: '4-8',
        readingTime: '4 min',
        imageUrl: '/stories/suenos-de-estrellas.svg',
        color: 'lavender',
    },
]

export function getStories() {
    return fabulas
}

export function getStoryBySlug(slug) {
    return fabulas.find((story) => story.slug === slug) || null
}

export function getCategories() {
    return Array.from(new Set(fabulas.map((story) => story.category)))
}
