import sharp from 'sharp'

const pairs = [
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019e9aa9-27f0-7623-b75f-d14df2be43e0/ig_0362a9baab929c34016a25b246237081919cf4e8a922dcf872.png',
        'public/stories/el_cuervo_y_las_plumas_prestadas.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019e9aa9-27f0-7623-b75f-d14df2be43e0/ig_0362a9baab929c34016a25b2d3c24081919a8019bfe294c6d0.png',
        'public/stories/el_lobo_y_la_grulla.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019e9aa9-27f0-7623-b75f-d14df2be43e0/ig_0362a9baab929c34016a25b35caae08191bdd893042319e8a4.png',
        'public/stories/la_cabra_y_el_cabrito.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019e9aa9-27f0-7623-b75f-d14df2be43e0/ig_0362a9baab929c34016a25b3db30b881919d60a3fb1d2fc19a.png',
        'public/stories/el_leon_y_los_tres_toros.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019e9aa9-27f0-7623-b75f-d14df2be43e0/ig_0362a9baab929c34016a25b5d39fb48191a7500b32fbf23c8e.png',
        'public/stories/el_caballo_y_el_ciervo.webp',
    ],
]

for (const [input, output] of pairs) {
    await sharp(input)
        .resize(1000, 750, { fit: 'cover', position: 'center' })
        .webp({ quality: 82, effort: 6 })
        .toFile(output)
    console.log(output)
}
