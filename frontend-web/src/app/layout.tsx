import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

// Carrega o isolador de efeitos APENAS no cliente
// Isso impede que qualquer lógica visual quebre o build do servidor
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
          bg-slate-950 text-slate-200 
          cursor-none 
          selection:bg-emerald-500/30 selection:text-emerald-200
          overflow-x-hidden
        `}
      >
        <LanguageProvider>
          
          {/* O ClientEffects contém todos os visuais pesados (Cursor, Partículas, Boot, Noise).
            Ele só será montado quando o navegador estiver pronto, evitando erros de hidratação.
          */}
          <ClientEffects />
          
          {/* Conteúdo Principal do Site */}
          <div className="relative z-10 animate-in fade-in duration-700 ease-out">
            {children}
          </div>

        </LanguageProvider>
      </body>
    </html>
  );
}
