"use client"

import type React from "react"

import { useState } from "react"
import { Mochiy_Pop_One } from "next/font/google"

const mochiyPopOne = Mochiy_Pop_One({ subsets: ["latin"], weight: "400" })

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)

/*************Windsurf Command*************/
/**
 * Handles input change event for the form.
 * Updates the formData state with the new input value.
 * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
 */
/*******  7b235c66-f96e-48a9-a8eb-daedcedfd64a  *******/  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    setLoading(true)
    console.log(isLogin ? "Login:" : "Register:", formData)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-LsbBrOScGCqeduOIHKvJisFnhpUQSk.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Logo and Tagline Header */}
      <div className="mb-12 text-center">
        <img
          src="images/eventory.png"
          alt="Eventory Logo"
          className="h-20 mx-auto mb-2"
        />
        <p className="text-slate-500 text-base font-medium">Quality Filipino and Bicolano Catering</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-lg">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 border border-white/30">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold text-[#003d5c] mb-2 ${mochiyPopOne.className}`}>Welcome</h1>
            <p className="text-slate-600 text-sm">Sign in to your account or create a new one</p>
          </div>

          {/* Toggle Tabs - Exact design match */}
          <div className="flex mb-8 bg-[#669BBC] p-1 rounded-lg gap-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 font-bold rounded-md transition-all duration-200 ${
                isLogin ? "bg-[#FFF9EB] text-[#003d5c] shadow-sm" : "text-white bg-transparent hover:opacity-90"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 font-bold rounded-md transition-all duration-200 ${
                !isLogin ? "bg-[#FFF9EB] text-[#003d5c] shadow-sm" : "text-white bg-transparent hover:opacity-90"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field - Only for Register */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                !isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-5">
                <label htmlFor="fullName" className="block text-[#003d5c] font-medium mb-2 text-sm">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  required={!isLogin}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#003d5c] font-medium mb-2 text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#003d5c] font-medium mb-2 text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password Field - Only for Register */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                !isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-5">
                <label htmlFor="confirmPassword" className="block text-[#003d5c] font-medium mb-2 text-sm">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#FFF9EB] border-2 border-[#e8d5c4] rounded-lg text-[#003d5c] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#669BBC] focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 bg-[#669BBC] hover:bg-[#5a87a8] text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign In" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
