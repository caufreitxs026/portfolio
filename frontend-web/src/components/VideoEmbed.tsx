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

    if (!videoId) return null;

    // Lógica de Fallback de Imagem:
    // 1. Prioridade para a URL que você subiu no Supabase (se for válida)
    // 2. Fallback para a versão High Quality do YouTube (sempre existe e é nítida)
    const isCustomThumbValid = thumbnailUrl && thumbnailUrl.includes('http');
    const fallbackThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const finalThumb = isCustomThumbValid ? thumbnailUrl : fallbackThumb;

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
            {!isPlaying ? (
                <div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                >
                    <img
                        src={finalThumb}
                        alt={title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                        onError={(e) => {
                            // Se até a customizada falhar, força a do YT
                            (e.target as HTMLImageElement).src = fallbackThumb;
                        }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="fill-current ml-1" size={32} />
                        </div>
                    </div>
                </div>
            ) : (
                <iframe
                    className="w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
}