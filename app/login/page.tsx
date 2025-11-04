"use client"

import type React from "react"

import { useState } from "react"
import { Mochiy_Pop_One, Archivo } from "next/font/google"

const mochiyPopOne = Mochiy_Pop_One({ subsets: ["latin"], weight: "400" })
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] })

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Register-only validation
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required"
      }
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    console.log(isLogin ? "Login:" : "Register:", formData)
    setTimeout(() => setLoading(false), 1000)
  }

  const isFormValid = () => {
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return false
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      return false
    }
    if (!isLogin) {
      if (!formData.fullName.trim()) return false
      if (!formData.confirmPassword.trim() || formData.password !== formData.confirmPassword) {
        return false
      }
    }
    return true
  }

  return (
    <main
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 ${archivo.className}`}
      style={{
        backgroundImage:
          "url(images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mb-8 md:mb-12 text-center">
        <img
          src="images/eventory.png"
          alt="Eventory Logo"
          className="h-16 md:h-20 mx-auto mb-2"
        />
        <p className="text-slate-500 text-sm md:text-base font-medium">Quality Filipino and Bicolano Catering</p>
      </div>

      <div className="w-full max-w-md md:max-w-lg relative z-0">
        <div className="bg-white/90 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30 relative">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <h1 className={`text-2xl md:text-3xl font-bold text-[#003d5c] mb-2 ${mochiyPopOne.className}`}>Welcome</h1>
            <p className="text-slate-600 text-xs md:text-sm font-medium">Sign in to your account or create a new one</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex mb-6 md:mb-8 bg-[#669BBC] p-1 rounded-lg gap-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setErrors({})
              }}
              className={`flex-1 py-2 md:py-3 px-3 md:px-4 font-bold text-sm md:text-base rounded-md transition-all duration-200 ${
                isLogin ? "bg-[#FFF9EB] text-[#003d5c] shadow-sm" : "text-white bg-transparent hover:opacity-90"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setErrors({})
              }}
              className={`flex-1 py-2 md:py-3 px-3 md:px-4 font-bold text-sm md:text-base rounded-md transition-all duration-200 ${
                !isLogin ? "bg-[#FFF9EB] text-[#003d5c] shadow-sm" : "text-white bg-transparent hover:opacity-90"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* Full Name Field - Only for Register */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                !isLogin ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-4 md:pb-5">
                <label htmlFor="fullName" className="block text-[#003d5c] font-medium mb-2 text-xs md:text-sm">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  required={!isLogin}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all ${
                    errors.fullName ? "border-red-500" : "border-[#e8d5c4]"
                  }`}
                  placeholder="Enter your full name"
                  autoComplete="off"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#003d5c] font-medium mb-2 text-xs md:text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 md:px-4 py-2 md:py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all ${
                  errors.email ? "border-red-500" : "border-[#e8d5c4]"
                }`}
                placeholder="Enter your email"
                autoComplete="off"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#003d5c] font-medium mb-2 text-xs md:text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 md:px-4 py-2 md:py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all ${
                  errors.password ? "border-red-500" : "border-[#e8d5c4]"
                }`}
                placeholder="Enter your password"
                autoComplete="off"
              />
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">Minimum 6 characters required</p>
              )}
            </div>

            {/* Confirm Password Field - Only for Register */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                !isLogin ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-4 md:pb-5">
                <label htmlFor="confirmPassword" className="block text-[#003d5c] font-medium mb-2 text-xs md:text-sm">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-[#e8d5c4]"
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="off"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Submit Button - Updated button text to show "Register" for registration mode */}
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full py-2 md:py-3 mt-4 md:mt-6 bg-[#669BBC] hover:bg-[#5a87a8] disabled:bg-[#a8b8cc] text-white font-bold text-sm md:text-base rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign In" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
