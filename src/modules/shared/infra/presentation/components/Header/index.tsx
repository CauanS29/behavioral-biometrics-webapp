import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CS2 Biometria Comportamental",
  description: "Sistema de análise de padrões de tiro para Counter-Strike 2",
}

export default function Header({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col`}>
        {/* Navbar */}
        <header className="w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <Link
                href="/"
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600"
              >
                CS2 Biometria
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm font-medium"
              >
                Início
              </Link>
              <Link
                href="/login"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm font-medium"
              >
                Registrar
              </Link>
            </nav>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Decoração de fundo */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        </div>
      </body>
    </html>
  )
}
