import Image from 'next/image'

export function StoryImage({ alt, className = '', imageUrl, priority = false, size = 'large' }) {
    const dimensions = size === 'thumb'
        ? { width: 180, height: 150 }
        : { width: 640, height: 480 }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white/50 ${className}`}>
            <Image
                src={imageUrl}
                width={dimensions.width}
                height={dimensions.height}
                alt={alt}
                priority={priority}
                className='h-full w-full rounded-[1.35rem] object-contain'
            />
        </div>
    )
}
