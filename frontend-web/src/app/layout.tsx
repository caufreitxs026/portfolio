import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

// Carrega o isolador de efeitos APENAS no cliente
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
  description: "Desenvolvedor Full Stack e Analista de Dados focado em soluções de alta performance.",
  keywords: ["Full Stack", "Data Analyst", "Python", "React", "Developer", "SQL", "Cauã Freitas"],
  authors: [{ name: "Cauã Freitas" }],
  creator: "Cauã Freitas",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://caufreitxs.vercel.app',
    title: 'Cauã Freitas | Full Stack & Data Analyst',
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
          /* MUDANÇA: bg-slate-900 é mais claro que 950. Texto base mais claro (slate-100) */
          bg-slate-900 text-slate-100 
          cursor-default 
          selection:bg-emerald-500/30 selection:text-emerald-200
          overflow-x-hidden
        `}
      >
        <LanguageProvider>
          
          <ClientEffects />

          {/* Textura de Ruido (Reduzida opacidade de 0.04 para 0.02 para limpar a visão) */}
          <div 
            className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.02] mix-blend-overlay"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
          />

          {/* Vinheta (Reduzida intensidade para clarear os cantos) */}
          <div className="fixed inset-0 z-[9997] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
          
          <div className="relative z-10 animate-in fade-in duration-700 ease-out">
            {children}
          </div>

        </LanguageProvider>
      </body>
    </html>
  );
}
