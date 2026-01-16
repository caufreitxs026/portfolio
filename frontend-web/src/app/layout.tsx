import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

const ClientEffects = dynamic(() => import("@/components/ClientEffects"), { 
  ssr: false 
});

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
          bg-[#020617] text-slate-100 
          cursor-default 
          selection:bg-emerald-500/30 selection:text-emerald-200
          overflow-x-hidden
        `}
      >
        <LanguageProvider>
          
          <ClientEffects />

          {/* --- AURORA BACKGROUND (O Visual "Arraso") --- */}
          <div className="fixed inset-0 z-[0] pointer-events-none overflow-hidden">
             {/* Blob Superior Direito (Emerald/Blue) */}
             <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(0,0,0,0)_70%)] blur-[100px] animate-pulse"></div>
             
             {/* Blob Inferior Esquerdo (Indigo/Purple) */}
             <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.06)_0%,rgba(0,0,0,0)_70%)] blur-[120px]"></div>
             
             {/* Blob Central Sutil */}
             <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.04)_0%,rgba(0,0,0,0)_70%)] blur-[80px]"></div>
          </div>

          {/* Textura de Ruido (Leve) */}
          <div 
            className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
          />

          {/* Vinheta (Foco Central) */}
          <div className="fixed inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.5)_100%)]" />
          
          <div className="relative z-10 animate-in fade-in duration-700 ease-out">
            {children}
          </div>

        </LanguageProvider>
      </body>
    </html>
  );
}
