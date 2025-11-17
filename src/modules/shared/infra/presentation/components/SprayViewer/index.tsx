"use client"

import { useEffect, useRef, useState } from "react"
import Papa from "papaparse"

interface Props {
  file: File | null
}

interface SprayPoint {
  deltaX: number
  deltaY: number
  timestamp?: number
}

export default function SprayViewer({ file }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stats, setStats] = useState<{
    points: number
    maxX: number
    maxY: number
    minX: number
    minY: number
  } | null>(null)

  useEffect(() => {
    if (!file) return

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = res.data as SprayPoint[]
        drawSpray(data)
      },
    })
  }, [file])

  const drawSpray = (data: SprayPoint[]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calcula as posições absolutas acumuladas
    const positions: { x: number; y: number }[] = []
    let x = 0
    let y = 0

    positions.push({ x, y })
    data.forEach((p) => {
      x += p.deltaX
      y += p.deltaY
      positions.push({ x, y })
    })

    // Encontra os limites
    const xs = positions.map((p) => p.x)
    const ys = positions.map((p) => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    // Atualiza as estatísticas
    setStats({
      points: positions.length,
      maxX,
      maxY,
      minX,
      minY,
    })

    // Calcula a escala para caber no canvas com margem
    const margin = 40
    const availableWidth = canvas.width - 2 * margin
    const availableHeight = canvas.height - 2 * margin

    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1

    const scaleX = availableWidth / rangeX
    const scaleY = availableHeight / rangeY
    const scale = Math.min(scaleX, scaleY) // Usa a menor escala para manter proporção

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Desenha grid de referência
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    
    // Linha vertical central
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()
    
    // Linha horizontal central
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
    
    ctx.setLineDash([])

    // Função para transformar coordenadas do spray para canvas
    const toCanvasX = (x: number) => {
      return margin + (x - minX) * scale
    }

    const toCanvasY = (y: number) => {
      return margin + (y - minY) * scale
    }

    // Desenha o spray
    ctx.strokeStyle = "#ff9900"
    ctx.lineWidth = 2
    ctx.lineJoin = "round"
    ctx.lineCap = "round"

    ctx.beginPath()
    const firstPos = positions[0]
    ctx.moveTo(toCanvasX(firstPos.x), toCanvasY(firstPos.y))

    for (let i = 1; i < positions.length; i++) {
      const pos = positions[i]
      ctx.lineTo(toCanvasX(pos.x), toCanvasY(pos.y))
    }

    ctx.stroke()

    // Marca o ponto inicial (verde)
    const startPos = positions[0]
    ctx.fillStyle = "#00ff00"
    ctx.beginPath()
    ctx.arc(toCanvasX(startPos.x), toCanvasY(startPos.y), 5, 0, Math.PI * 2)
    ctx.fill()

    // Marca o ponto final (vermelho)
    const endPos = positions[positions.length - 1]
    ctx.fillStyle = "#ff0000"
    ctx.beginPath()
    ctx.arc(toCanvasX(endPos.x), toCanvasY(endPos.y), 5, 0, Math.PI * 2)
    ctx.fill()

    // Legenda
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px monospace"
    ctx.fillText("● Início", 10, 20)
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(10, 8, 8, 8)
    
    ctx.fillStyle = "#ffffff"
    ctx.fillText("● Fim", 10, 40)
    ctx.fillStyle = "#ff0000"
    ctx.fillRect(10, 28, 8, 8)
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg text-white mb-2">Visualização do Spray</h3>

      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="border border-gray-700 bg-gray-900 rounded"
      />

      {stats && (
        <div className="mt-3 text-sm text-gray-400 space-y-1">
          <p>Total de pontos: {stats.points}</p>
          <p>
            Deslocamento X: {stats.minX.toFixed(2)} até {stats.maxX.toFixed(2)}{" "}
            (Δ: {(stats.maxX - stats.minX).toFixed(2)})
          </p>
          <p>
            Deslocamento Y: {stats.minY.toFixed(2)} até {stats.maxY.toFixed(2)}{" "}
            (Δ: {(stats.maxY - stats.minY).toFixed(2)})
          </p>
        </div>
      )}

      {!file && (
        <p className="text-gray-500 text-sm mt-2">
          Envie um CSV para visualizar o padrão do spray
        </p>
      )}
    </div>
  )
}