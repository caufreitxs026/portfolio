import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

// OTIMIZAÇÃO CRÍTICA: Carregamento dinâmico de TODOS os componentes visuais/interativos
// Isso evita erros de "window not found" e problemas de hidratação no Next.js
// pois garante que eles só rodem quando o navegador estiver 100% pronto.

const SystemBoot = dynamic(() => import("@/components/SystemBoot"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const EffectsWrapper = dynamic(() => import("@/components/EffectsWrapper"), { ssr: false });
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://caufreitxs.vercel.app'), 
  title: {
    default: "Cauã Freitas | Full Stack & Data Analyst",
    template: "%s | Cauã Freitas"
  },
  description: "Portfólio interativo de Cauã Freitas. Desenvolvedor Full Stack e Analista de Dados focado em soluções de alta performance.",
  keywords: ["Full Stack", "Data Analyst", "Python", "React", "Developer", "Cauã Freitas"],
  authors: [{ name: "Cauã Freitas" }],
  creator: "Cauã Freitas",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://caufreitxs.vercel.app',
    title: 'Cauã Freitas | Digital Portfolio',
    description: 'Transformando dados em experiências digitais imersivas.',
    siteName: 'Cauã Freitas Portfolio',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="scroll-smooth">
      <body 
        className={`
          ${inter.variable} ${jetbrainsMono.variable} 
          font-sans antialiased 
          bg-slate-950 text-slate-200 
          cursor-none 
          selection:bg-emerald-500/30 selection:text-emerald-200
          overflow-x-hidden
        `}
      >
        <LanguageProvider>
          
          {/* Componentes carregados SOMENTE no cliente (Segurança contra erros de build) */}
          <SystemBoot />
          <EffectsWrapper />
          <CustomCursor />
          <ScrollProgress />
          <ParticleBackground />

          {/* Textura de Ruido (Noise) */}
          <div 
            className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.04] mix-blend-overlay"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
          />

          {/* Vinheta (Bordas Escuras) */}
          <div className="fixed inset-0 z-[9997] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          
          {/* Conteudo Principal */}
          <div className="relative z-10 animate-in fade-in duration-700 ease-out">
            {children}
          </div>

        </LanguageProvider>
      </body>
    </html>
  );
}
