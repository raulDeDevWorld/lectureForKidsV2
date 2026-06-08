import sharp from 'sharp'

const pairs = [
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25e5de7ce881919b75d4b68bcb0c1c.png',
        'public/stories/el_labrador_y_la_serpiente.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25e6309abc819186b52436a985b806.png',
        'public/stories/la_mujer_y_la_gallina.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25e68fd164819182ef544d9a8412b4.png',
        'public/stories/el_mono_y_el_delfin.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25e6dba5f48191862a7666b2cb8fcd.png',
        'public/stories/la_zorra_y_el_leon.webp',
    ],
    [
        'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3/ig_021279f53d89adb5016a25e729c9a48191a8b128fd60ac9d86.png',
        'public/stories/el_pastor_y_el_mar.webp',
    ],
]

for (const [input, output] of pairs) {
    await sharp(input)
        .resize(1000, 750, { fit: 'cover', position: 'center' })
        .webp({ quality: 82, effort: 6 })
        .toFile(output)
    console.log(output)
}
