"use client"

import Link from "next/link"
import { useState } from "react"
import { Mochiy_Pop_One, Archivo } from "next/font/google"

const mochiyPopOne = Mochiy_Pop_One({ subsets: ["latin"], weight: "400" })
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] })

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    console.log("Register:", formData)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <main
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 ${archivo.className}`}
      style={{
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Logo and Tagline */}
      <div className="mb-8 md:mb-12 text-center">
        <img
          src="/images/eventory.png"
          alt="Eventory Logo"
          className="h-16 md:h-20 mx-auto mb-2"
        />
        <p className="text-slate-500 text-sm md:text-base font-medium">
          Quality Filipino and Bicolano Catering
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md md:max-w-lg bg-white/90 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1
            className={`text-2xl md:text-3xl font-bold text-[#003d5c] mb-2 ${mochiyPopOne.className}`}
          >
            Create Account
          </h1>
          <p className="text-slate-600 text-xs md:text-sm font-medium">
            Join us today
          </p>
        </div>

        {/* Toggle Buttons (same design) */}
        <div className="flex mb-6 md:mb-8 bg-[#669BBC] p-1 rounded-lg gap-1">
          <Link
            href="/login"
            className="flex-1 py-2 md:py-3 px-3 md:px-4 font-bold text-sm md:text-base rounded-md text-white text-center hover:opacity-90 transition-all"
          >
            Login
          </Link>
          <button
            type="button"
            className="flex-1 py-2 md:py-3 px-3 md:px-4 font-bold text-sm md:text-base rounded-md bg-[#FFF9EB] text-[#003d5c] shadow-sm"
          >
            Register
          </button>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] transition-all"
              placeholder="Confirm your password"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-[#669BBC] hover:bg-[#5a87a8] text-white font-bold text-base rounded-lg transition-all duration-300 disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  )
}
