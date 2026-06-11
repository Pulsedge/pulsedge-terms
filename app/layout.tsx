import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Pulsedge — Inteligência de mercado ambiental",
  description:
    "Chegue antes da concorrência com inteligência de mercado ambiental. Monitoramento de fontes públicas: CETESB, e-Ambiente e Receita Federal.",
  icons: { icon: "/pulsedge_icon.png" },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${inter.className} font-sans`}>{children}</body>
    </html>
  )
}
