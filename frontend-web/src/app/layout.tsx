import type { Metadata } from "next";
import "./globals.css";

// Metadados para SEO (Aparecem no Google e na aba do navegador)
export const metadata: Metadata = {
  title: "Cauã Freitas | Full Stack Developer",
  description: "Portfólio de Cauã Freitas. Desenvolvedor Full Stack especializado em Python, React e Análise de Dados.",
  icons: {
    icon: "/favicon.ico", // Opcional: Se quiser adicionar um ícone depois
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-300 antialiased">
        {children}
      </body>
    </html>
  );
}