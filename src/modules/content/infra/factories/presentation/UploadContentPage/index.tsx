"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Upload, FileText, X, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UseContent from "../../../services/hooks/useContent"

export default function UploadContentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [userName, setUserName] = useState("")
  const [selectedWeapon, setSelectedWeapon] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { handleUploadContent, isPending, error, data } = UseContent()
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    // Reset states
    setUploadStatus("idle")
    setErrorMessage("")

    // Check if file is CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setErrorMessage("Por favor, selecione um arquivo CSV válido.")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("O arquivo é muito grande. O tamanho máximo é 5MB.")
      return
    }

    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) return

    // Validar campos obrigatórios
    if (!userName.trim()) {
      setErrorMessage("Por favor, informe seu nome.")
      return
    }

    if (!selectedWeapon) {
      setErrorMessage("Por favor, selecione uma arma.")
      return
    }

    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      // Converter arquivo para base64
      const fileContent = await file.text()
      
      await handleUploadContent({
        userID: userName,
        weapon: selectedWeapon,
        sprayData: fileContent,
      });
      
      clearInterval(interval)
      setUploadStatus("success")
      setUploadProgress(100)
    } catch (error) {
      clearInterval(interval)
      setUploadStatus("error")
      setErrorMessage("Ocorreu um erro durante o upload. Tente novamente.")
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadStatus("idle")
    setErrorMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">CS2 Biometria Comportamental</h1>
        <p className="text-gray-300">Sistema avançado de identificação de jogadores através de padrões de movimento e tiro</p>
      </div>

      <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-orange-500">
          <Upload className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Dados do Jogador e Upload</h2>
        </div>
        
        <p className="text-gray-300 mb-6">
          Informe seu nome, a arma utilizada e faça upload do arquivo CSV contendo os dados de movimento do mouse durante os tiros para análise.
        </p>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-medium text-gray-300">
              Seu nome
            </Label>
            <Input
              id="userName"
              placeholder="Digite seu nome ou nickname"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-gray-800 border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weapon" className="text-sm font-medium text-gray-300">
              Arma utilizada
            </Label>
            <Select value={selectedWeapon} onValueChange={setSelectedWeapon}>
              <SelectTrigger id="weapon" className="bg-gray-800 border-gray-700 focus:ring-orange-500/20 text-gray-300">
                <SelectValue placeholder="Selecione a arma" />
              </SelectTrigger>
              <SelectContent className="bg-gray-300 border-gray-700">
                <SelectItem value="ak47">AK-47</SelectItem>
                <SelectItem value="m4a4">M4A4</SelectItem>
                <SelectItem value="m4a1s">M4A1-S</SelectItem>
                <SelectItem value="awp">AWP</SelectItem>
                <SelectItem value="deagle">Desert Eagle</SelectItem>
                <SelectItem value="mp9">MP9</SelectItem>
                <SelectItem value="mac10">MAC-10</SelectItem>
                <SelectItem value="ump45">UMP-45</SelectItem>
                <SelectItem value="p90">P90</SelectItem>
                <SelectItem value="sg553">SG 553</SelectItem>
                <SelectItem value="aug">AUG</SelectItem>
                <SelectItem value="galil">Galil AR</SelectItem>
                <SelectItem value="famas">FAMAS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-orange-500 bg-orange-500/10"
              : file
                ? "border-gray-600 bg-gray-700/50"
                : "border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-700/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />

          {!file ? (
            <div className="py-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-medium text-gray-300">Arraste e solte seu arquivo CSV aqui</p>
              <p className="text-sm text-gray-400 mt-1">ou clique para selecionar</p>
              <p className="text-xs text-gray-500 mt-4">Formato suportado: CSV (máx. 5MB)</p>
            </div>
          ) : (
            <div className="py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-400 mr-3" />
                  <div className="text-left">
                    <p className="font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB • CSV</p>
                  </div>
                </div>
                {!isPending && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    className="p-1 rounded-full hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                )}
              </div>

              {isPending && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Enviando...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center justify-center mt-4 text-green-500">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Upload concluído com sucesso!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {file && uploadStatus !== "success" && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpload} disabled={isPending} className="bg-orange-600 hover:bg-orange-700">
              {isPending ? "Enviando..." : "Enviar arquivo"}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <Info className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Como funciona</h2>
        </div>
        
        <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
          <li>Capture os dados de movimento do mouse durante os tiros no CS2</li>
          <li>Exporte os dados para um arquivo CSV (delta x, delta y, timestamp)</li>
          <li>Faça upload do arquivo nesta plataforma</li>
        </ol>
      </div>
    </div>
  )
}
