"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    const stored = typeof window !== "undefined" ? localStorage.getItem("current_user") : null

    if (!token || !stored) {
      router.replace("/login")
      return
    }

    try {
      const parsed = JSON.parse(stored)
      const email = (parsed.email || "").toLowerCase()
      const isAdmin =
        Boolean(parsed.isAdmin) ||
        email === "rabad@gbox.adnu.edu.ph" ||
        email === "charnepomuceno@gbox.adnu.edu.ph"

      if (!isAdmin) {
        router.replace("/login")
        return
      }

      setChecked(true)
    } catch {
      router.replace("/login")
    }
  }, [router])

  if (!checked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Checking admin access...</p>
      </main>
    )
  }

  return <>{children}</>
}


