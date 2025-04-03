"use client"

import type React from "react"

import { useEffect } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
  active: boolean
  elapsedTime: number
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>
}

export function Timer({ active, elapsedTime, setElapsedTime }: TimerProps) {
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (active) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [active, setElapsedTime])

  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60

  return (
    <div className="flex items-center gap-1 text-sm" data-tour-id="timer">
      <Clock className="h-4 w-4" />
      <span>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}

