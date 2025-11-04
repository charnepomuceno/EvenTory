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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    console.log("Register:", formData)
    setTimeout(() => setLoading(false), 1000)
  }

  const isFormValid = () =>
    formData.fullName.trim() &&
    formData.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.trim().length >= 6 &&
    formData.password === formData.confirmPassword

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
      <div className="mb-8 md:mb-12 text-center">
        <img src="/images/eventory.png" alt="Eventory Logo" className="h-16 md:h-20 mx-auto mb-2" />
        <p className="text-slate-500 text-sm md:text-base font-medium">
          Quality Filipino and Bicolano Catering
        </p>
      </div>

      <div className="w-full max-w-md md:max-w-lg bg-white/90 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30">
        <div className="mb-6 md:mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold text-[#003d5c] mb-2 ${mochiyPopOne.className}`}>
            Create Account
          </h1>
          <p className="text-slate-600 text-xs md:text-sm font-medium">Join us today</p>
        </div>

        {/* Toggle Buttons */}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] focus:ring-2 focus:ring-[#669BBC] transition-all ${
                errors.fullName ? "border-red-500" : "border-[#e8d5c4]"
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] focus:ring-2 focus:ring-[#669BBC] transition-all ${
                errors.email ? "border-red-500" : "border-[#e8d5c4]"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] focus:ring-2 focus:ring-[#669BBC] transition-all ${
                errors.password ? "border-red-500" : "border-[#e8d5c4]"
              }`}
              placeholder="Enter your password"
            />
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">Minimum 6 characters required</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[#003d5c] font-medium mb-2 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] focus:ring-2 focus:ring-[#669BBC] transition-all ${
                errors.confirmPassword ? "border-red-500" : "border-[#e8d5c4]"
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`w-full py-3 mt-4 font-bold text-base rounded-lg transition-all duration-300 ${
              !isFormValid() || loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#669BBC] hover:bg-[#5a87a8] text-white"
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  )
}
