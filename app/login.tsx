// ...existing code...
"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mochiy_Pop_One } from "next/font/google"

const mochiyPopOne = Mochiy_Pop_One({
  subsets: ["latin"],
  weight: "400",
})

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sign in with:", { email, password })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url(/Background.png)",
        backgroundColor: "rgba(102, 155, 188, 0.45)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-black/5" />

      <div className="relative z-10 w-full max-w-2xl px-4" style={{ backdropFilter: "blur(10px)" }}>
        <div className="text-center mb-12">
          <div className="flex flex-col items-center mb-2">
            <img src="/logo.png" alt="Eventory Logo" className="w-52 h-auto mb-3" />
            <p className="text-[#52707A] text-lg">Quality Filipino and Bicolano Catering</p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#669BBC]/20 rounded-2xl shadow-md shadow-[#669BBC]/20 p-8 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className={`text-3xl font-bold text-blue-900 mb-2 ${mochiyPopOne.className}`}>Welcome</h2>
            <p className="text-gray-600">Sign in to your account or create a new one</p>
          </div>

          {/* Top buttons kept exactly (Login active) */}
          <div className="flex gap-2 mb-8">
            <button
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors bg-white text-[#669BBC] border-2 border-[#669BBC]"
              aria-current="page"
            >
              Login
            </button>

            <Link
              href="/register"
              className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-colors bg-[#669BBC]/90 text-white hover:bg-[#5588A4]/90"
            >
              Register
            </Link>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-[#669BBC]/20 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#669BBC]/50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-[#669BBC]/20 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#669BBC]/50"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#669BBC]/90 hover:bg-[#5588A4]/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
// ...existing code...