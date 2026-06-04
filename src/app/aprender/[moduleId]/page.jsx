import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@/components/icons/Icons'
import { AppShell } from '@/components/layout/AppShell'
import { LearningLevelOneClient } from '@/components/learning/LearningLevelOneClient'
import { getLevelOneModuleById, levelOneModules } from '@/data/learningLevelOne'

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
        title: `${learningModule.title} | Aprender`,
        description: learningModule.prompt,
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
