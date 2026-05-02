import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
    url: string;
    title: string;
    thumbnailUrl?: string | null;
}

export default function VideoEmbed({ url, title, thumbnailUrl }: VideoEmbedProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [coverImage, setCoverImage] = useState<string>('');

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);

    // Inicializa a imagem. Prioriza o upload do painel (Supabase), depois tenta a thumb HD do YouTube.
    useEffect(() => {
        if (videoId) {
            setCoverImage(thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
        }
    }, [videoId, thumbnailUrl]);

    if (!videoId) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 border border-slate-800 rounded-lg">
                URL de vídeo inválida
            </div>
        );
    }

    // Interceptador de erro 404 da imagem
    const handleImageError = () => {
        // Se a imagem de resolução máxima não existir no YouTube, cai para a imagem padrão que sempre existe
        if (coverImage.includes('maxresdefault')) {
            setCoverImage(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        }
    };

    const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&vq=hd1080&color=white`;

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl shadow-lg bg-black aspect-video group">
            {!isPlaying ? (
                <div
                    className="absolute inset-0 cursor-pointer flex items-center justify-center"
                    onClick={() => setIsPlaying(true)}
                >
                    <img
                        src={coverImage}
                        alt={`Capa do vídeo: ${title}`}
                        onError={handleImageError}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    {/* Overlay escuro sutil para garantir contraste no botão Play */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />

                    {/* Botão Play Customizado */}
                    <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-transform duration-300 group-hover:scale-110">
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