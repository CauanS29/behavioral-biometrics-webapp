import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/modules/shared/infra/presentation/components/LoginForm"

export const metadata: Metadata = {
  title: "Login | CS2 Biometria Comportamental",
  description: "Acesse sua conta no sistema de análise de padrões de tiro para Counter-Strike 2",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            CS2 Biometria
          </h1>
          <p className="text-gray-400 mt-1">Acesse sua conta para continuar</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <LoginForm />
          </div>

          {/* Rodapé do Card */}
          <div className="bg-gray-900 p-4 border-t border-gray-700 flex justify-between items-center text-sm">
            <Link href="/register" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
              Criar uma conta
            </Link>
            <Link
              href="/forgot-password"
              className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Ao fazer login, você concorda com nossos{" "}
            <Link href="/terms" className="text-orange-500 hover:text-orange-400">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-orange-500 hover:text-orange-400">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>

      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
