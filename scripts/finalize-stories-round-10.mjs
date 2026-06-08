import sharp from 'sharp'

const pairs = [
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25f1a6b64881918700201144b9cf0c.png',
        'public/stories/la_liebre_y_las_ranas.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25f2318c7c8191b97dbbee0b89cf0c.png',
        'public/stories/el_murcielago_y_las_comadrejas.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25f2f55e48819194a468bda5badf9d.png',
        'public/stories/el_aguila_y_el_escarabajo.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25f36ffb0c8191ac4985257d01b385.png',
        'public/stories/el_aguila_y_la_flecha.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25f41003f48191baff5312e4f09ab7.png',
        'public/stories/el_cuervo_y_la_serpiente.webp',
    ],
]

for (const [input, output] of pairs) {
    await sharp(input)
        .resize(1000, 750, { fit: 'cover', position: 'center' })
        .webp({ quality: 82, effort: 6 })
        .toFile(output)
    console.log(output)
}
