import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { LearningLevelOneClient } from '@/components/learning/LearningLevelOneClient'
import { getLevelOneModuleById, levelOneModules } from '@/data/learningLevelOne'
import { createBreadcrumbJsonLd, createJsonLdScript, createLearningModuleJsonLd, createPageMetadata } from '@/lib/seo'

export function generateStaticParams() {
    return levelOneModules.map((module) => ({
        moduleId: module.id,
    }))
}

export async function generateMetadata({ params }) {
    const { moduleId } = await params
    const learningModule = getLevelOneModuleById(moduleId)

    if (!learningModule) {
        return {
            title: 'Actividad no encontrada',
        }
    }

    return {
        ...createPageMetadata({
            title: `${learningModule.title} para aprender a leer`,
            description: `${learningModule.prompt} Actividad infantil de Lectorin para practicar lectura inicial con imagenes, voz y palabras faciles.`,
            path: `/aprender/${learningModule.id}/`,
            images: [
                {
                    url: learningModule.items?.[0]?.imageUrl,
                    width: 640,
                    height: 480,
                    alt: `${learningModule.title} para aprender a leer`,
                },
            ],
            keywords: [learningModule.title, `${learningModule.title} para ninos`, 'lectura inicial'],
        }),
    }
}

export default async function LearnModulePage({ params }) {
    const { moduleId } = await params
    const learningModule = getLevelOneModuleById(moduleId)

    if (!learningModule) {
        notFound()
    }

    return (
        <AppShell>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={createJsonLdScript([
                    createLearningModuleJsonLd(learningModule),
                    createBreadcrumbJsonLd([
                        { name: 'Inicio', path: '/' },
                        { name: 'Aprender', path: '/aprender/' },
                        { name: learningModule.title, path: `/aprender/${learningModule.id}/` },
                    ]),
                ])}
            />
            <div className='space-y-5'>
                <header className='rounded-[2rem] bg-white/80 p-4 shadow-[0_12px_34px_rgba(31,42,68,0.08)] ring-1 ring-white/80 backdrop-blur'>
                    <div className='flex items-center gap-3'>
                        <Link href='/aprender' aria-label='Volver a aprender' className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(31,42,68,0.10)]'>
                            <ArrowLeftIcon className='h-6 w-6' />
                        </Link>
                        <div className='min-w-0'>
                            <p className='text-xs font-black uppercase tracking-[0.14em] text-[#7A8194]'>Nivel 1</p>
                            <h1 className='text-3xl font-black leading-tight text-[#1F2A44]'>{learningModule.title}</h1>
                            <p className='mt-1 text-sm font-bold text-[#7A8194]'>{learningModule.prompt}</p>
                        </div>
                    </div>
                </header>

                <LearningLevelOneClient modules={[learningModule]} />
            </div>
        </AppShell>
    )
}
