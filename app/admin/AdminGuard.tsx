"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)

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
        setUnauthorized(true)
        setTimeout(() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back()
          } else {
            router.replace("/home")
          }
        }, 2000)
        return
      }

      setChecked(true)
    } catch {
      router.replace("/login")
    }
  }, [router])

  if (unauthorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-1">Only administrators can access this page.</p>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!checked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Checking admin access...</p>
      </main>
    )
  }

  return <>{children}</>
}


