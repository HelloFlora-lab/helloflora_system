"use client"
import { Theme, useTheme } from "@lib/context/theme-context"
import { clx } from "@medusajs/ui"

// 1. Mappa che associa ogni tema a un codice colore
const themeColors: Record<Theme, string> = {
  spring: "#FFB5DE", // Verde menta
  summer: "#DB304D", // Giallo sole
  autumn: "#EF4A00", // Arancio terracotta
  winter: "#96A0FF", // Azzurro pallido
}

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const themes: Theme[] = ["spring", "summer", "autumn", "winter"]

  return (
    <div className="flex space-x-1 p-4">
      {themes.map((themeName) => (
        <button
          key={themeName}
          // 2. Applica lo stile in linea per il colore di sfondo
          style={{ backgroundColor: themeColors[themeName] }}
          className={clx(
            "w-6 h-6 rounded-full border-2", // Rimuovi la classe bg-* dinamica
            theme === themeName ? `border-theme-accent  ring-theme-accent` : "border-transparent ring-offset-1",
          )}
          onClick={() => setTheme(themeName)}
          title={themeName}
        ></button>
      ))}
    </div>
  )
}

export default ThemeSwitcher