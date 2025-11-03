import type React from "react"
import type { Metadata } from "next"
import { Archivo, Mochiy_Pop_One } from "next/font/google"
import "./globals.css"

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" })
const mochiyPopOne = Mochiy_Pop_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mochiy-pop-one",
})

export const metadata: Metadata = {
  title: "EvenTory - Make Your Event Unforgettable",
  description: "Professional event catering and management services"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${mochiyPopOne.variable} font-archivo antialiased`}>{children}</body>
    </html>
  )
}