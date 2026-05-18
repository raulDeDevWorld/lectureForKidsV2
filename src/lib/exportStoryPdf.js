const SECTION_LABELS = {
    title: 'Titulo',
    content: 'Historia',
    teaching: 'Moraleja',
}

export function exportStorySectionPdf(story, section) {
    const sectionKey = section === 'COMPLETE' ? 'content' : section
    const label = SECTION_LABELS[sectionKey] || 'Seccion'
    const text = getStorySectionText(story, sectionKey)

    openPrintablePdf({
        title: `${story.title} - ${label}`,
        subtitle: label,
        sections: [{ heading: label, text }],
    })
}

export function exportFullStoryPdf(story) {
    openPrintablePdf({
        title: story.title,
        subtitle: story.category,
        sections: getPrintableStorySections(story),
    })
}

export function exportAllStoriesPdf(stories) {
    openPrintablePdf({
        title: 'Todas las fabulas',
        subtitle: `${stories.length} historias`,
        sections: stories.flatMap((story, index) => [
            {
                heading: `${index + 1}. ${story.title}`,
                text: [getStorySectionText(story, 'content'), `Moraleja: ${story.teaching}`].filter(Boolean).join('\n\n'),
                pageBreakBefore: index > 0,
            },
        ]),
    })
}

function getStorySectionText(story, section) {
    const value = story?.[section]
    if (Array.isArray(value)) return value.join('\n\n')
    return String(value || '')
}

function getPrintableStorySections(story) {
    return [
        { heading: SECTION_LABELS.title, text: story.title },
        { heading: SECTION_LABELS.content, text: getStorySectionText(story, 'content') },
        { heading: SECTION_LABELS.teaching, text: story.teaching },
    ]
}

function openPrintablePdf({ title, subtitle, sections }) {
    if (typeof window === 'undefined') return

    const printWindow = window.open('', '_blank', 'width=900,height=1100')
    if (!printWindow) {
        window.print()
        return
    }

    printWindow.document.open()
    printWindow.document.write(createPrintableHtml({ title, subtitle, sections }))
    printWindow.document.close()

    printWindow.setTimeout(() => {
        printWindow.focus()
        printWindow.print()
    }, 250)
}

function createPrintableHtml({ title, subtitle, sections }) {
    const safeTitle = escapeHtml(title)
    const safeSubtitle = escapeHtml(subtitle)
    const sectionHtml = sections
        .filter((section) => section.text)
        .map((section) => `
            <section class="${section.pageBreakBefore ? 'page-break' : ''}">
                <h2>${escapeHtml(section.heading)}</h2>
                ${formatParagraphs(section.text)}
            </section>
        `)
        .join('')

    return `<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <style>
        @page { margin: 18mm; }
        * { box-sizing: border-box; }
        body {
            color: #1f2a44;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.55;
            margin: 0;
        }
        header {
            border-bottom: 3px solid #ffd166;
            margin-bottom: 24px;
            padding-bottom: 16px;
        }
        .eyebrow {
            color: #64748b;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: .12em;
            margin: 0 0 8px;
            text-transform: uppercase;
        }
        h1 {
            font-size: 32px;
            line-height: 1.15;
            margin: 0;
        }
        h2 {
            color: #075985;
            font-size: 18px;
            margin: 24px 0 10px;
        }
        .page-break {
            break-before: page;
            page-break-before: always;
        }
        p {
            font-size: 15px;
            margin: 0 0 12px;
        }
        .footer {
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 11px;
            margin-top: 28px;
            padding-top: 12px;
        }
    </style>
</head>
<body>
    <header>
        <p class="eyebrow">${safeSubtitle}</p>
        <h1>${safeTitle}</h1>
    </header>
    ${sectionHtml}
    <p class="footer">Fabulas 3000</p>
</body>
</html>`
}

function formatParagraphs(text) {
    return String(text || '')
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join('')
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}
