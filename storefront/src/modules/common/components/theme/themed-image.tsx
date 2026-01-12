"use client"

import { useTheme } from "@lib/context/theme-context"
import Image, { ImageProps } from "next/image"

type ThemeImageProps = Omit<ImageProps, "src"> & {
  srcTemplate: string // Es. "/images/hero-{theme}.jpg"
}

const ThemeImage = ({ srcTemplate, ...props }: ThemeImageProps) => {
  const { theme } = useTheme()

  // Sostituisce il placeholder {theme} con il tema corrente
  const src = srcTemplate.replace("{theme}", theme)

  return <Image src={src} {...props} />
}

export default ThemeImage