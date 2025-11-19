"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { Mochiy_Pop_One, Archivo } from 'next/font/google'

const mochiyPopOne = Mochiy_Pop_One({ subsets: ["latin"], weight: "400" })
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700"] })

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, "")))
      newErrors.phoneNumber = "Please enter a valid phone number"

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

    setTimeout(() => {
      const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "{}")
      registeredUsers[formData.phoneNumber] = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      }
      localStorage.setItem("registered_users", JSON.stringify(registeredUsers))

      setLoading(false)
      setShowSuccessPopup(true)
    }, 1500)
  }

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false)
    router.push("/login")
  }

  const isFormValid = () =>
    formData.fullName.trim() &&
    formData.phoneNumber.trim() &&
    /^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, "")) &&
    formData.password.trim().length >= 6 &&
    formData.password === formData.confirmPassword

  return (
    <>
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className={`text-2xl font-bold text-[#003d5c] mb-2 ${mochiyPopOne.className}`}>
              Account Created!
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              Your account has been successfully created. You can now log in with your credentials.
            </p>
            <button
              onClick={handleSuccessPopupClose}
              className="w-full py-3 bg-[#669BBC] hover:bg-[#5a87a8] text-white font-bold rounded-lg transition-all"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#669BBC] border-t-transparent mx-auto mb-4"></div>
            <p className={`text-[#003d5c] font-semibold ${mochiyPopOne.className}`}>Creating account...</p>
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
                placeholder="Enter your Full Name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-[#003d5c] font-medium mb-2 text-sm">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#FFF9EB] border-2 rounded-lg text-[#003d5c] focus:ring-2 focus:ring-[#669BBC] transition-all ${
                  errors.phoneNumber ? "border-red-500" : "border-[#e8d5c4]"
                }`}
                placeholder="Enter your Phone Number"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

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
                placeholder="Enter your Password"
              />
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">Minimum of 6 characters required</p>
              )}
            </div>

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
                placeholder="Confirm your Password"
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs md:text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#669BBC] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
