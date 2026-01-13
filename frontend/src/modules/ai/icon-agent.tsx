'use client'
import { useTheme } from "@lib/context/theme-context"
import React from "react"

interface MenuIconProps {
  alt: string
  size?: number // 1. Aggiunta la prop 'size' opzionale
}


const IconAIAgent = ({ alt, size = 20 }: MenuIconProps) => { // 2. Imposta una dimensione di default a 20px


  const { theme } = useTheme();

  return (
    <img
      src={`/images/AI_agent_${theme}.png`}
      alt={alt}
      className="inline-block ml-2 align-middle"
      style={{ width: size, height: size }}
    />
)

}

export default IconAIAgent