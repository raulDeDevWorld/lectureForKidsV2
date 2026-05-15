'use client'

import dynamic from 'next/dynamic'

const Reader = dynamic(() => import('@/components/Component'), { ssr: false })

export default function LecturePage() {
    return <Reader />
}
