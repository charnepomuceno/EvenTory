"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { Mochiy_Pop_One, Archivo } from 'next/font/google'
import { Eye, EyeOff } from 'lucide-react'

const mochiyPopOne = Mochiy_Pop_One({ subsets: ["latin"], weight: "400" })
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] })

const getRegisteredUsers = () => {
  if (typeof window === "undefined") return {}
  const users = localStorage.getItem("registered_users")
  return users ? JSON.parse(users) : {}
}

export default function LoginPage() {
  const router = useRouter()
  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ credential: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.credential.trim()) {
      newErrors.credential = `${loginType === 'phone' ? 'Phone number' : 'Email'} is required`
    } else if (loginType === 'phone') {
      if (!/^\d{10,}$/.test(formData.credential.replace(/\D/g, "")))
        newErrors.credential = "Please enter a valid phone number"
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.credential))
        newErrors.credential = "Please enter a valid email"
    }

    if (!formData.password.trim()) newErrors.password = "Password is required"
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters"

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

    const registeredUsers = getRegisteredUsers()
    let userRecord = null
    let userKey = null

    if (loginType === 'phone') {
      userKey = formData.credential
      userRecord = registeredUsers[userKey]
    } else {
      // Search by email
      userKey = Object.keys(registeredUsers).find(
        key => registeredUsers[key].email === formData.credential
      )
      userRecord = userKey ? registeredUsers[userKey] : null
    }

    const isAdmin = formData.credential === "0912345678" && formData.password === "Admin123"
    const isRegistered = userRecord !== null

    if (!isAdmin && !isRegistered) {
      setErrors({ credential: "User not registered. Please register first." })
      return
    }

    if (isRegistered && userRecord.password !== formData.password) {
      setErrors({ password: "Incorrect password" })
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (isAdmin) {
        router.push("/admin-dashboard")
      } else {
        localStorage.setItem("current_user", JSON.stringify({
          phoneNumber: userRecord.phoneNumber || "",
          fullName: userRecord.fullName || "",
          email: userRecord.email || "",
        }))
        router.push("/home")
      }
    }, 2000)
  }

  const isFormValid = () =>
    formData.credential.trim() &&
    (loginType === 'phone'
      ? /^\d{10,}$/.test(formData.credential.replace(/\D/g, ""))
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.credential)) &&
    formData.password.trim().length >= 6

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#669BBC] border-t-transparent mx-auto mb-4"></div>
            <p className={`text-[#003d5c] font-semibold ${mochiyPopOne.className}`}>Signing in...</p>
          </div>
        </div>
      )}

      <main
        className={`min-h-screen w-full flex items-center justify-center p-4 md:p-6 ${archivo.className}`}
        style={{
          backgroundImage: "url(/images/bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-md md:max-w-lg bg-white/90 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30">
          <div className="mb-8 md:mb-10 text-center">
            <img src="/images/eventory.png" alt="Eventory Logo" className="h-16 md:h-20 mx-auto mb-3" />
            <p className="text-slate-500 text-sm md:text-base font-medium">
              Quality Filipino and Bicolano Catering
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#003d5c] font-medium mb-3 text-sm">Login with:</label>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setLoginType('phone')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                    loginType === 'phone'
                      ? 'bg-[#669BBC] text-white'
                      : 'bg-[#FFF9EB] text-[#003d5c] border-2 border-[#e8d5c4]'
                  }`}
                >
                  Phone Number
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('email')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                    loginType === 'email'
                      ? 'bg-[#669BBC] text-white'
                      : 'bg-[#FFF9EB] text-[#003d5c] border-2 border-[#e8d5c4]'
                  }`}
                >
                  Email
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#003d5c] font-medium mb-2 text-sm">
                {loginType === 'phone' ? 'Phone Number' : 'Email'}
              </label>
              <input
                type="text"
                name="credential"
                required
                value={formData.credential}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] focus:ring-2 focus:ring-[#669BBC] transition-all ${
                  errors.credential ? "border-red-500" : "border-[#e8d5c4]"
                }`}
                placeholder={loginType === 'phone' ? "Enter your Phone Number" : "Enter your Email"}
              />
              {errors.credential && <p className="text-red-500 text-xs mt-1">{errors.credential}</p>}
            </div>

            <div>
              <label className="block text-[#003d5c] font-medium mb-2 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-10 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] focus:ring-2 focus:ring-[#669BBC] transition-all ${
                    errors.password ? "border-red-500" : "border-[#e8d5c4]"
                  }`}
                  placeholder="Enter your Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#003d5c] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">Minimum 6 characters required</p>
              )}
              <div className="text-right mt-2">
                <a href="#" className="text-[#669BBC] text-xs hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full py-3 mt-4 font-bold text-base rounded-lg transition-all duration-300 cursor-pointer ${
                !isFormValid() || loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#669BBC] hover:bg-[#5a87a8] text-white"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs md:text-sm mt-4">
            {"Don't have an account?"}
            <Link href="/register" className="text-[#669BBC] font-semibold hover:underline">
              {" "}Sign up
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
