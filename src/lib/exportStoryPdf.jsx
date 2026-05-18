import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
    pdf,
} from '@react-pdf/renderer'
import { slugify } from './slugify'

const SECTION_LABELS = {
    title: 'Titulo',
    content: 'Historia',
    teaching: 'Moraleja',
}

const imageCache = new Map()

export async function exportFullStoryPdf(story) {
    const preparedStories = [await prepareStoryForPdf(story)]
    const blob = await pdf(<StoriesPdfDocument stories={preparedStories} />).toBlob()

    downloadBlob(blob, `${slugify(story.title) || 'fabula'}.pdf`)
}

export async function exportAllStoriesPdf(stories) {
    const preparedStories = await Promise.all(stories.map(prepareStoryForPdf))
    const blob = await pdf(<StoriesPdfDocument stories={preparedStories} />).toBlob()

    downloadBlob(blob, 'todas-las-fabulas.pdf')
}

async function prepareStoryForPdf(story) {
    return {
        ...story,
        pdfImageUrl: await getPdfImageUrl(story.imageUrl),
        sections: getPrintableStorySections(story),
    }
}

function StoriesPdfDocument({ stories }) {
    return (
        <Document title={stories.length === 1 ? stories[0].title : 'Todas las fabulas'}>
            {stories.map((story, index) => (
                <StoryPage key={story.id || story.slug || story.title} story={story} showIndex={stories.length > 1} index={index} />
            ))}
        </Document>
    )
}

function StoryPage({ index, showIndex, story }) {
    return (
        <Page size='A4' style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>{story.category || 'Fabula'}</Text>
                <Text style={styles.title}>{showIndex ? `${index + 1}. ${story.title}` : story.title}</Text>
                {story.pdfImageUrl ? (
                    <Image src={story.pdfImageUrl} style={styles.coverImage} alt={story.title} />
                ) : null}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{SECTION_LABELS.content}</Text>
                {getStoryParagraphs(story.content).map((paragraph, paragraphIndex) => (
                    <Text key={`${story.id || story.slug}-p-${paragraphIndex}`} style={styles.paragraph}>
                        {paragraph}
                    </Text>
                ))}
            </View>

            {story.teaching ? (
                <View style={styles.teachingBox}>
                    <Text style={styles.teachingLabel}>{SECTION_LABELS.teaching}</Text>
                    <Text style={styles.teachingText}>{story.teaching}</Text>
                </View>
            ) : null}

            <Text
                fixed
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            />
        </Page>
    )
}

function getPrintableStorySections(story) {
    return [
        { heading: SECTION_LABELS.title, text: story.title },
        { heading: SECTION_LABELS.content, text: getStorySectionText(story, 'content') },
        { heading: SECTION_LABELS.teaching, text: story.teaching },
    ]
}

function getStoryParagraphs(content) {
    if (Array.isArray(content)) {
        return content.map((paragraph) => String(paragraph).trim()).filter(Boolean)
    }

    return String(content || '')
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
}

function getStorySectionText(story, section) {
    const value = story?.[section]
    if (Array.isArray(value)) return value.join('\n\n')
    return String(value || '')
}

async function getPdfImageUrl(imageUrl) {
    if (!imageUrl || typeof window === 'undefined') return null

    if (imageCache.has(imageUrl)) {
        return imageCache.get(imageUrl)
    }

    const imagePromise = convertImageToPngDataUrl(imageUrl).catch(() => null)
    imageCache.set(imageUrl, imagePromise)

    return imagePromise
}

async function convertImageToPngDataUrl(imageUrl) {
    const absoluteUrl = new URL(imageUrl, window.location.origin).toString()

    return new Promise((resolve, reject) => {
        const image = new window.Image()
        image.crossOrigin = 'anonymous'
        image.onload = () => {
            const canvas = window.document.createElement('canvas')
            canvas.width = image.naturalWidth || image.width
            canvas.height = image.naturalHeight || image.height

            const context = canvas.getContext('2d')
            if (!context) {
                reject(new Error('Canvas context unavailable'))
                return
            }

            context.drawImage(image, 0, 0)
            resolve(canvas.toDataURL('image/png'))
        }
        image.onerror = reject
        image.src = absoluteUrl
    })
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        color: '#1f2a44',
        fontFamily: 'Helvetica',
        fontSize: 12,
        lineHeight: 1.45,
        paddingBottom: 48,
        paddingHorizontal: 42,
        paddingTop: 38,
    },
    header: {
        borderBottomColor: '#ffd166',
        borderBottomWidth: 3,
        marginBottom: 18,
        paddingBottom: 14,
    },
    eyebrow: {
        color: '#64748b',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 1.4,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    title: {
        color: '#1f2a44',
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.15,
    },
    coverImage: {
        alignSelf: 'center',
        height: 190,
        marginTop: 14,
        objectFit: 'contain',
        width: 300,
    },
    section: {
        marginTop: 6,
    },
    sectionTitle: {
        color: '#075985',
        fontSize: 15,
        fontWeight: 700,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 12,
        marginBottom: 8,
    },
    teachingBox: {
        backgroundColor: '#fff7cc',
        borderColor: '#facc15',
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 12,
        padding: 12,
    },
    teachingLabel: {
        color: '#8a5a00',
        fontSize: 10,
        fontWeight: 700,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    teachingText: {
        color: '#1f2a44',
        fontSize: 12,
        fontWeight: 700,
    },
    pageNumber: {
        bottom: 24,
        color: '#94a3b8',
        fontSize: 9,
        position: 'absolute',
        right: 42,
    },
})
