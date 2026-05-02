import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
    url: string;
    title: string;
    thumbnailUrl?: string | null;
}

export default function VideoEmbed({ url, title, thumbnailUrl }: VideoEmbedProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);

    if (!videoId) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 border border-slate-800 rounded-lg">
                URL de vídeo inválida
            </div>
        );
    }

    // Validação: Prioriza a capa do painel (media_url). Se falhar, usa a thumb padrão do YouTube.
    const isValidCustomThumb = thumbnailUrl && thumbnailUrl.trim().startsWith('http');
    const coverImage = isValidCustomThumb ? thumbnailUrl : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&vq=hd1080&color=white`;

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl shadow-lg bg-black aspect-video group">
            {!isPlaying ? (
                <div
                    className="absolute inset-0 cursor-pointer flex items-center justify-center bg-slate-950"
                    onClick={() => setIsPlaying(true)}
                >
                    <img
                        src={coverImage}
                        alt={`Capa do vídeo: ${title}`}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />

                    <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600/95 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 sm:ml-2 fill-current" />
                    </div>
                </div>
            ) : (
                <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={iframeSrc}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            )}
        </div>
    );
}