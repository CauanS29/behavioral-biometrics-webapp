"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/modules/user/infra/services/hooks/useAuth"

// Schema de validação com Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
})

// Tipo TypeScript derivado do schema
type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormData) {
    setError("")
    setIsLoading(true)


    try {
      await login.handleLogin({
        email: data.email,
        password: data.password,
      })


      router.push("/enviar-conteudo")
    } catch (err: any) {
      console.error("Erro detalhado:", err)
      
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Ocorreu um erro ao fazer login. Tente novamente."
      setError(errorMessage)
      console.error("Erro no login:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(error || login.error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || login.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="Seu email"
          autoComplete="email"
          className={`bg-gray-900 border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 ${
            errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Sua senha"
          autoComplete="current-password"
          className={`bg-gray-900 border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 ${
            errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          }`}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || login.isPending}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
      >
        {isLoading || login.isPending ? "Entrando..." : "Entrar"}
      </Button>

    </form>
  )
}
