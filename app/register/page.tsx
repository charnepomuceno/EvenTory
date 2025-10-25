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

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register with:", { fullName, email, password, confirmPassword })
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
            <h2 className={`text-3xl font-bold text-blue-900 mb-2 ${mochiyPopOne.className}`}>Create an account</h2>
            <p className="text-gray-600">Register a new account</p>
          </div>

          {/* Top buttons kept exactly (Register active) */}
          <div className="flex gap-2 mb-8">
            <Link
              href="/login"
              className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-colors bg-[#669BBC]/90 text-white hover:bg-[#5588A4]/90"
            >
              Login
            </Link>

            <button
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors bg-white text-[#669BBC] border-2 border-[#669BBC]"
              aria-current="page"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-[#669BBC]/20 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#669BBC]/50"
                placeholder="Enter your full name"
              />
            </div>

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

            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-[#669BBC]/20 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#669BBC]/50"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#669BBC]/90 hover:bg-[#5588A4]/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-sm"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
// ...existing code...