import sharp from 'sharp'

const pairs = [
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25fb7ae9c88191bfcad840779d45ca.png',
        'public/stories/la_golondrina_y_los_pajaros.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25fc0ff7e48191b73d84bdbcc8e99d.png',
        'public/stories/el_cangrejo_y_su_madre.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25fcafa15c81918884ce9b926d0ee8.png',
        'public/stories/el_jabali_y_la_zorra.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25ff08617c8191823df6c181c1d457.png',
        'public/stories/los_viajeros_y_el_hacha.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25ffb843a88191987c9b7c14d40348.png',
        'public/stories/el_hombre_y_el_satiro.webp',
    ],
]

for (const [input, output] of pairs) {
    await sharp(input)
        .resize(1000, 750, { fit: 'cover', position: 'center' })
        .webp({ quality: 82, effort: 6 })
        .toFile(output)
    console.log(output)
}
