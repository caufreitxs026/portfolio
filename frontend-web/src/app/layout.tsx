import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';
import ParticleBackground from '@/components/ParticleBackground';
import EffectsWrapper from '@/components/EffectsWrapper';

const baseUrl = process.env.NEXT_PUBLIC_API_URL 
  ? "https://caufreitxs.vercel.app" 
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Cauã Freitas | Full Stack Developer",
  description: "Portfólio de Cauã Freitas. Desenvolvedor Full Stack especializado em Python, React e Análise de Dados.",
  keywords: ["Desenvolvedor", "Full Stack", "Python", "React", "Next.js", "Data Science", "Portfólio"],
  authors: [{ name: "Cauã Freitas" }],
  openGraph: {
    title: "Cauã Freitas | Full Stack Developer",
    description: "Transformando dados em inteligência e código em solução.",
    url: baseUrl,
    siteName: "Portfólio Cauã Freitas",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Preview do Portfólio",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cauã Freitas | Full Stack Developer",
    description: "Confira meu portfólio profissional.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth cursor-none">
      <body className="bg-slate-950 text-slate-300 antialiased relative selection:bg-emerald-500 selection:text-white">
        
        <EffectsWrapper />
        <ScrollProgress />
        <CustomCursor />
        
        {/* Fundo fica fora do filtro para não bugar */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <ParticleBackground />
        </div>
        
        {/* WRAPPER DE CONTEÚDO PRINCIPAL
            É aqui que a classe .secret-mode-content será aplicada pelo EffectsWrapper.
            Isso isola o filtro do CSS apenas no conteúdo da página, 
            deixando os Portais (como o Modal do Jogo) livres de interferência.
        */}
        <div id="main-content" className="relative z-10 flex flex-col min-h-screen transition-all duration-500">
          {children}
        </div>
        
        {/* O Portal do Jogo será injetado no final do body, fora do #main-content */}
      </body>
    </html>
  );
}
