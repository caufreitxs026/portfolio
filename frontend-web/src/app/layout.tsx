import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import dynamic from "next/dynamic";

// Carregando apenas os efeitos essenciais e leves
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
          cursor-default 
          overflow-x-hidden
        `}
      >
        <ThemeProvider>
          <LanguageProvider>
            
            <BackgroundWrapper>
              <ClientEffects />
              
              <div className="relative z-10 animate-in fade-in duration-700 ease-out">
                {children}
              </div>
            </BackgroundWrapper>

          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
