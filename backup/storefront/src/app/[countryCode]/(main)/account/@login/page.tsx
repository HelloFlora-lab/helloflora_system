import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Accedi o Registrati - HelloFlora",
  description: "Accedi al tuo account HelloFlora per salvare i tuoi preferiti, gestire i tuoi ordini e vivere un'esperienza di acquisto personalizzata nel mondo dei fiori.",
   robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
}
  
export default function Login() {
  return <LoginTemplate />
}
