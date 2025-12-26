import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cauã Freitas | Full Stack Developer",
  description: "Desenvolvedor Full Stack e Analista de Dados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      {/* cursor-none: Esconde o cursor padrão do sistema para usar o nosso */}
      <body className={`${inter.className} cursor-none selection:bg-emerald-500/30 selection:text-emerald-200`}>
        <LanguageProvider>
          {/* Componente do Cursor Global */}
          <CustomCursor />
          
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
