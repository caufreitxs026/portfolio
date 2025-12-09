import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';
import ParticleBackground from '@/components/ParticleBackground';

// Pega a URL do site (em produção ou localhost)
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
    <html lang="pt-BR" className="scroll-smooth cursor-none"> {/* cursor-none esconde o padrão */}
      <body className="bg-slate-950 text-slate-300 antialiased relative">
        <ScrollProgress />
        <CustomCursor />
        <ParticleBackground />
        
        {/* Conteúdo Principal */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
