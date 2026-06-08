import sharp from 'sharp'

const pairs = [
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25ea6499308191b569d921a950369c.png',
        'public/stories/el_lobo_y_el_cordero.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25eafb88908191beaafed8d484ea0f.png',
        'public/stories/el_perro_en_el_pesebre.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25eb8abbf08191908925517c4b7f49.png',
        'public/stories/el_gallo_y_la_joya.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25ebf2bb9081919ce9e0661094e126.png',
        'public/stories/el_avaro_y_su_oro.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25ec6502f881918e3a6b5b0e26d3d1.png',
        'public/stories/el_astronomo.webp',
    ],
]

for (const [input, output] of pairs) {
    await sharp(input)
        .resize(1000, 750, { fit: 'cover', position: 'center' })
        .webp({ quality: 82, effort: 6 })
        .toFile(output)
    console.log(output)
}
