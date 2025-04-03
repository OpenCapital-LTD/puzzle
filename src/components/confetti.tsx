"use client"

import { useEffect, useRef } from "react"

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width
    canvas.height = height

    let animationFrameId: number

    const colors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7"]
    const gravity = 8
    const confettiCount = 300

    const confetti = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < confetti.length; i++) {
        const c = confetti[i]
        ctx.beginPath()
        ctx.lineWidth = c.r
        ctx.strokeStyle = c.color
        ctx.moveTo(c.x + c.tilt + c.r / 2, c.y)
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2)
        ctx.stroke()
      }

      update()
      animationFrameId = requestAnimationFrame(draw)
    }

    const update = () => {
      for (let i = 0; i < confetti.length; i++) {
        const c = confetti[i]
        c.tiltAngle += c.tiltAngleIncremental
        c.y += gravity
        c.x += Math.sin(c.tiltAngle)
        c.tilt = Math.sin(c.tiltAngle) * 15

        if (c.y > height) {
          c.y = -10
          c.x = Math.random() * width
        }
      }
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
      }}
    />
  )
}
