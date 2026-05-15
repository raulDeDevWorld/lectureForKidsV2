import { fabulas } from '@/db/fabulas';
import Link from 'next/link';

const DEFAULT_STORY_IMAGE = '/tiger.png';
const storyCount = Object.keys(fabulas).length;

function Home() {
    return (
        <div className='relative min-h-screen w-full overflow-hidden bg-[#fff7d6] px-4 py-6 text-slate-900 md:px-8 md:py-10'>
            <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#fff7d6_0%,#b7ecff_48%,#d8ffd4_100%)]' />
            <div className='pointer-events-none absolute left-0 right-0 top-0 h-28 bg-[linear-gradient(90deg,#ff8a65,#ffd166,#5ed3f3,#8bd17c)] opacity-90' />
            <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(90deg,#8bd17c,#5ed3f3,#ffd166,#ff8a65)] opacity-80' />

            <header className='relative mx-auto mb-8 flex max-w-6xl flex-col items-center gap-5 rounded-lg border-4 border-white bg-white/85 px-5 py-6 text-center shadow-[0_14px_0_rgba(15,23,42,0.12)] md:flex-row md:justify-between md:px-8 md:text-left'>
                <div>
                    <p className='text-sm font-bold uppercase tracking-[0.2em] text-[#ef6c00]'>Lectura para pequenos exploradores</p>
                    <h1 className='mt-2 text-4xl font-black text-[#1f3a5f] md:text-6xl'>Fabulas 3000</h1>
                    <p className='mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-700 md:text-lg'>
                        Elige una historia, escucha cada palabra y practica leyendo en voz alta.
                    </p>
                    <div className='mt-4 inline-flex rounded-full bg-[#1f3a5f] px-4 py-2 text-sm font-bold text-white shadow'>
                        {storyCount} historias para leer
                    </div>
                </div>

                <div className='relative h-36 w-36 shrink-0 rounded-full border-4 border-[#ffd166] bg-[#fff2b8] p-3 shadow-lg md:h-44 md:w-44'>
                    <img
                        src={DEFAULT_STORY_IMAGE}
                        className='h-full w-full rounded-full object-cover'
                        alt='Mascota de Fabulas 3000'
                    />
                </div>
            </header>

            <div className='relative mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {Object.entries(fabulas).map(([id, story]) => (
                    <Link key={id} href={`/Lecture?item=${encodeURIComponent(id)}`} className='group block'>
                        <article className='relative h-full overflow-hidden rounded-lg border-4 border-white bg-white shadow-[0_8px_0_rgba(15,23,42,0.12)] transition-transform group-hover:-translate-y-1 group-hover:shadow-[0_12px_0_rgba(15,23,42,0.14)]'>
                            <div className='h-3 bg-[linear-gradient(90deg,#ff8a65,#ffd166,#8bd17c,#5ed3f3)]' />
                            <img
                                src={story.face || story.img || DEFAULT_STORY_IMAGE}
                                className='h-[185px] w-full bg-[#fff2b8] object-contain p-5'
                                alt={story.title}
                            />
                            <div className='border-t-2 border-dashed border-[#ffd166] p-4'>
                                <h2 className='min-h-[54px] text-center text-lg font-black leading-6 text-[#1f3a5f]'>{story.title}</h2>
                                <p className='mt-3 rounded-full bg-[#e8f7ff] px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#1976a3]'>
                                    Leer ahora
                                </p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Home
