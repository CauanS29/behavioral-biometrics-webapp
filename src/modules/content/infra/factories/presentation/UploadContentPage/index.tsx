"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Info,
  Film,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { environment } from "@/modules/shared/infra/config/environment";

export default function UploadContentPage() {
  const MAX_DEM_FILE_SIZE_MB = 1024;
  const MAX_DEM_FILE_SIZE_BYTES = MAX_DEM_FILE_SIZE_MB * 1024 * 1024;
  const MAX_SUCCESS_RESPONSE_PARSE_BYTES = 1 * 1024 * 1024;

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Reset states
    setUploadStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");

    // Check if file is .dem
    if (!file.name.toLowerCase().endsWith(".dem")) {
      setErrorMessage("Por favor, selecione um arquivo .dem válido.");
      return;
    }

    // Check file size (max 1GB - demos podem ser grandes)
    if (file.size > MAX_DEM_FILE_SIZE_BYTES) {
      setErrorMessage(
        `O arquivo é muito grande. O tamanho maximo e ${MAX_DEM_FILE_SIZE_MB}MB.`,
      );
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Validar campos obrigatórios
    if (!userName.trim()) {
      setErrorMessage("Por favor, informe seu nome.");
      return;
    }

    setIsPending(true);
    setUploadProgress(0);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Criar FormData para enviar como multipart/form-data
      const formData = new FormData();
      formData.append("userID", userName);
      formData.append("demoFile", file, file.name);

      const response = await new Promise<{
        ok: boolean;
        status: number;
        bodyText: string;
      }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", `${environment.apiUrl}sprays`, true);

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        };

        xhr.onerror = () => reject(new Error("Falha de rede durante upload"));
        xhr.ontimeout = () => reject(new Error("Timeout durante upload"));
        xhr.timeout = 30 * 60 * 1000;

        xhr.onload = () => {
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            bodyText: xhr.responseText || "",
          });
        };

        xhr.send(formData);
      });

      setUploadProgress(100);

      let responseData: { message?: string; data?: unknown[] } | null = null;
      if (response.bodyText.length > 0 &&
          response.bodyText.length <= MAX_SUCCESS_RESPONSE_PARSE_BYTES) {
        try {
          responseData = JSON.parse(response.bodyText);
        } catch {
          responseData = null;
        }
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          `Erro ao fazer upload (status ${response.status}).`;
        throw new Error(errorMessage);
      }

      setUploadStatus("success");
      setSuccessMessage(
        responseData?.message ||
          "Upload enviado com sucesso. O processamento foi iniciado."
      );
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro durante o upload. Tente novamente."
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">
          CS2 Biometria Comportamental
        </h1>
        <p className="text-gray-300">
          Sistema avançado de identificação de jogadores através de análise de
          replays de partidas
        </p>
      </div>

      <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-orange-500">
          <Upload className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            Dados do Jogador e Upload de Replay
          </h2>
        </div>

        <p className="text-gray-300 mb-6">
          Informe seu nome e faça upload do arquivo .dem (replay de partida) do
          Counter-Strike 2 para análise comportamental.
        </p>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 bg-green-900/20 border-green-500/50">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 mb-6">
          <Label
            htmlFor="userName"
            className="text-sm font-medium text-gray-300"
          >
            Seu nome
          </Label>
          <Input
            id="userName"
            placeholder="Digite seu nome ou nickname"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-gray-800 border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 text-gray-300"
            disabled={isPending}
          />
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-orange-500 bg-orange-500/10"
              : file
              ? "border-gray-600 bg-gray-700/50"
              : "border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-700/50"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && !isPending && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".dem"
            className="hidden"
            disabled={isPending}
          />

          {!file ? (
            <div className="py-4">
              <Film className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-medium text-gray-300">
                Arraste e solte seu arquivo .dem aqui
              </p>
              <p className="text-sm text-gray-400 mt-1">
                ou clique para selecionar
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Formato suportado: .dem (max. {MAX_DEM_FILE_SIZE_MB}MB)
              </p>
            </div>
          ) : (
            <div className="py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Film className="h-8 w-8 text-purple-400 mr-3" />
                  <div className="text-left">
                    <p className="font-medium truncate max-w-xs text-gray-300">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Demo Replay
                    </p>
                  </div>
                </div>
                {!isPending && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
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
                    <span>Processando demo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center justify-center mt-4 text-green-500">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Processamento concluído!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {file && uploadStatus !== "success" && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleUpload}
              disabled={isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isPending ? "Processando..." : "Enviar replay"}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <Info className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Como funciona</h2>
        </div>

        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-semibold text-orange-400 mb-2">
              1. Obtenha o arquivo de replay
            </h3>
            <p className="text-sm ml-4">
              No CS2, vá em &quot;Assistir&quot; → &quot;Suas Partidas&quot; e
              baixe o replay da partida desejada (arquivo .dem)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-orange-400 mb-2">
              2. Faça o upload
            </h3>
            <p className="text-sm ml-4">
              Informe seu nome e faça upload do arquivo .dem nesta plataforma
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-orange-400 mb-2">
              3. Processamento automático
            </h3>
            <p className="text-sm ml-4">
              O sistema extrairá automaticamente todos os padrões de spray de todas as armas utilizadas durante a partida
            </p>
          </div>
        </div>

        <Alert className="mt-6 bg-blue-900/20 border-blue-500/50">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            Os arquivos .dem contêm dados completos da partida, permitindo uma
            análise mais precisa do seu comportamento em jogo. O sistema detecta automaticamente
            sprays com 3 ou mais tiros consecutivos.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
