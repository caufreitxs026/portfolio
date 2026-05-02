import React from 'react';

interface VideoEmbedProps {
    url: string;
    title: string;
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
    // Função auxiliar para extrair o ID do vídeo de URLs comuns do YouTube
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);

    if (!videoId) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 border border-gray-700 rounded-lg">
                URL de vídeo inválida
            </div>
        );
    }

    return (
        <div className="w-full relative overflow-hidden rounded-lg shadow-lg border border-gray-800 bg-black aspect-video">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}