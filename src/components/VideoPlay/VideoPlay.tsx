import Video from 'next-video';
import { useEffect, useRef, useState } from 'react';

interface VideoPlayProps {
    url: string;
    poster: string;
    blurDataURL: string;
    markVideoAsCompleted?: () => void; // nova prop
}

export default function VideoPlay({ url, poster, blurDataURL, markVideoAsCompleted }: VideoPlayProps) {
    const [stateCover, setStateCover] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [videoSize, setVideoSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    });

    const updateVideoSize = (): void => {
        if (videoContainerRef.current) {
            const width = videoContainerRef.current.offsetWidth;
            const height = width * 9 / 16;
            setVideoSize({ width, height });
        }
    };

    useEffect(() => {
        updateVideoSize();
        window.addEventListener('resize', updateVideoSize);
        return () => {
            window.removeEventListener('resize', updateVideoSize);
        };
    }, []);

    return (
        <div className={`relative w-full ${stateCover ? 'hidden' : ''}`} style={{ height: `${videoSize.height}px` }}>
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${blurDataURL})` }}
            />
            <Video
                autoPlay
                src={url}
                poster={poster}
                onEnded={() => markVideoAsCompleted?.()}
                className="relative z-10"
            />
        </div>

    );
}
