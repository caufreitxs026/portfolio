import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CustomCursor from "@/components/CustomCursor";
import EffectsWrapper from "@/components/EffectsWrapper";
import ParticleBackground from "@/components/ParticleBackground";
import ScrollProgress from "@/components/ScrollProgress";

// Configuração de Fontes Premium
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
  title: "Cauã Freitas | Full Stack Developer",
  description: "Desenvolvedor Full Stack e Analista de Dados",
  icons: {
    icon: '/favicon.ico', // Certifique-se de ter um favicon
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="scroll-smooth">
      {/* Classes Globais:
        - cursor-none: Remove cursor padrão para usar o customizado.
        - selection: Personaliza a cor de seleção de texto (match com o tema).
        - antialiased: Renderização de fonte mais nítida.
      */}
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
          
          {/* --- CAMADA DE TEXTURA (NOISE) --- */}
          {/* Adiciona uma textura sutil de granulação para um visual 'film-like' menos digital/plástico */}
          <div 
            className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.03] mix-blend-overlay"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
          />

          {/* --- EFEITOS GLOBAIS --- */}
          <EffectsWrapper />
          <CustomCursor />
          <ScrollProgress />
          <ParticleBackground />
          
          {/* Conteúdo Principal */}
          <div className="relative z-10">
            {children}
          </div>

        </LanguageProvider>
      </body>
    </html>
  );
}
