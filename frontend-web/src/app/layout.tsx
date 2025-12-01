import type { Metadata } from "next";
import "./globals.css";

// Metadados para SEO e Redes Sociais
export const metadata: Metadata = {
  title: "Cauã Freitas | Full Stack Developer",
  description: "Portfólio de Cauã Freitas. Desenvolvedor Full Stack especializado em Python, React e Análise de Dados. Confira meus projetos e trajetória.",
  keywords: ["Desenvolvedor", "Full Stack", "Python", "React", "Next.js", "Data Science", "Portfólio"],
  authors: [{ name: "Cauã Freitas" }],
  openGraph: {
    title: "Cauã Freitas | Full Stack Developer",
    description: "Transformando dados em inteligência e código em solução.",
    url: "https://caufreitxs.vercel.app", // Sua URL final
    siteName: "Portfólio Cauã Freitas",
    images: [
      {
        url: "/opengraph-image.png", // Você precisará criar essa imagem na pasta public
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
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-300 antialiased">
        {children}
      </body>
    </html>
  );
}
