import { ThemeProvider } from "@lib/context/theme-context"
import ThemeScript from "@modules/common/components/theme/theme-script" // Importa il nuovo script
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { GoogleTagManager } from "@next/third-parties/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),

  icons: {
    icon: [
      { url: '/favicons/autumn/favicon.ico' },
      { url: '/favicons/autumn/favicon-32x32.png', type: 'image/png' },
    ],
    apple: [
      { url: '/favicons/apple-icon.png' },
    ],
  }


}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Il tag <html> non ha bisogno di attributi qui, ci pensa lo script
    <html lang="it" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <GoogleTagManager gtmId="GTM-5FRRZK9Q" />
        <ThemeProvider>
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
