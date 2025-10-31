"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Calendar } from "lucide-react"

export default function BookPage() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showCalendar, setShowCalendar] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9)) // October 2025
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(null)

  const dateStatuses = {
    available: [1, 3, 4, 5, 6, 8, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 23, 24, 25, 27, 28, 29, 31],
    booked: [2, 7, 10, 21, 22],
    pending: [13, 30],
  }

  const [selectedPackageInfo, setSelectedPackageInfo] = useState<any>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    numberOfGuests: "",
    eventDate: "",
    eventLocation: "",
    preferredPackage: "",
    specialRequests: "",
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      }))
    }

    const packageData = sessionStorage.getItem("selectedPackage")
    if (packageData) {
      const parsed = JSON.parse(packageData)
      setSelectedPackageInfo(parsed)
      setFormData((prev) => ({
        ...prev,
        preferredPackage: parsed.name,
      }))
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-+()]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatDateDisplay = (year: number, month: number, day: number): string => {
    const date = new Date(year, month, day)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const isDateInPastOrToday = (year: number, month: number, day: number): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(year, month, day)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate <= today
  }

  const getDateStatus = (day: number): "available" | "booked" | "pending" | "past" => {
    if (isDateInPastOrToday(currentDate.getFullYear(), currentDate.getMonth(), day)) {
      return "past"
    }
    if (dateStatuses.booked.includes(day)) return "booked"
    if (dateStatuses.pending.includes(day)) return "pending"
    return "available"
  }

  const getDateColor = (day: number) => {
    const status = getDateStatus(day)
    if (status === "past") return "bg-gray-100 text-gray-400 cursor-not-allowed"
    if (status === "booked") return "bg-red-100 text-red-700 cursor-not-allowed"
    if (status === "pending") return "bg-yellow-100 text-yellow-700 cursor-not-allowed"
    return "bg-green-50 text-green-700 hover:bg-green-200 cursor-pointer"
  }

  const handleDateClick = (day: number) => {
    const status = getDateStatus(day)
    if (status === "available") {
      const formattedDisplay = formatDateDisplay(currentDate.getFullYear(), currentDate.getMonth(), day)
      setFormData((prev) => ({
        ...prev,
        eventDate: formattedDisplay,
      }))
      setShowCalendar(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null)
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.fullName.trim()) {
      setError("Full Name is required")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!formData.phone.trim()) {
      setError("Phone Number is required")
      return
    }
    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid phone number")
      return
    }
    if (!formData.eventType) {
      setError("Event Type is required")
      return
    }
    if (!formData.numberOfGuests.trim()) {
      setError("Number of Guests is required")
      return
    }
    if (!formData.eventDate) {
      setError("Event Date is required")
      return
    }
    if (!formData.eventLocation.trim()) {
      setError("Event Location is required")
      return
    }
    if (!formData.preferredPackage.trim()) {
      setError("Preferred Package is required. Please select a package from the Packages page first.")
      return
    }

    // Simulate form submission
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        eventType: "",
        numberOfGuests: "",
        eventDate: "",
        eventLocation: "",
        preferredPackage: "",
        specialRequests: "",
      })
      setTimeout(() => setSubmitted(false), 3000)
    }, 1000)
  }

  const isActive = (href: string) => pathname === href

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="shrink-0 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Image
                src="/images/eventory.png"
                alt="EvenTory"
                width={140}
                height={60}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-15">
              <Link
                href="/menu"
                className={`transition-colors text-base font-medium opacity-0 animate-fade-in ${
                  isActive("/menu") ? "text-accent font-semibold" : "text-foreground hover:text-accent"
                }`}
                style={{ animationDelay: "0.3s" }}
              >
                Menu
              </Link>
              <Link
                href="/packages"
                className={`transition-colors text-base font-medium opacity-0 animate-fade-in ${
                  isActive("/packages") ? "text-accent font-semibold" : "text-foreground hover:text-accent"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                Packages
              </Link>
              <Link
                href="/book"
                className={`transition-colors text-base font-medium opacity-0 animate-fade-in ${
                  isActive("/book") ? "text-accent font-semibold" : "text-foreground hover:text-accent"
                }`}
                style={{ animationDelay: "0.5s" }}
              >
                Book Now
              </Link>
              <Link
                href="/feedback"
                className={`transition-colors text-base font-medium opacity-0 animate-fade-in ${
                  isActive("/feedback") ? "text-accent font-semibold" : "text-foreground hover:text-accent"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                Feedback
              </Link>
            </nav>

            <Link href="/profile" className="opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <button
                className={`px-4 py-2 rounded-full transition-colors text-base font-medium ${
                  isActive("/profile")
                    ? "bg-accent text-primary-foreground border border-accent"
                    : "text-foreground border border-foreground hover:bg-accent hover:text-primary-foreground"
                }`}
              >
                Profile
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full pt-20 md:pt-24 pb-2 md:pb-4 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <Image src="/images/background.png" alt="Background" fill className="object-cover" priority />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[300px] md:min-h-[350px]">
          <div className="text-center space-y-4 md:space-y-6">
            <h1
              className="text-4xl md:text-5xl font-mochiy text-primary opacity-0 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Book Your Event
            </h1>
            <p
              className="text-lg md:text-xl text-foreground font-archivo opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Fill out the form below and we will get back to you within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pt-2 pb-20 md:pt-4 md:pb-28 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-16 md:mb-24 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-mochiy text-primary mb-2">Event Details</h2>
              <p className="text-foreground/70 text-base font-archivo">
                Please provide information about your upcoming event
              </p>
            </div>

            {selectedPackageInfo && (
              <div className="mb-8 p-4 bg-secondary/50 rounded-lg border border-border">
                <h3 className="font-mochiy text-primary text-lg mb-3">Selected Package</h3>
                <div className="space-y-3 text-sm font-archivo">
                  <p>
                    <span className="font-semibold">Package:</span> {selectedPackageInfo.name}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> ₱{selectedPackageInfo.price?.toLocaleString()}
                  </p>
                  {selectedPackageInfo.customItems && (
                    <div>
                      <p className="font-semibold mb-2">Included Items:</p>
                      <ul className="list-disc list-inside space-y-1 text-foreground/80">
                        {selectedPackageInfo.customItems.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information Section */}
              <div>
                <h3 className="text-xl font-mochiy text-primary mb-6">Contact Information</h3>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-foreground font-archivo text-sm mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground placeholder:text-foreground/50 font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-foreground font-archivo text-sm mb-2">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground placeholder:text-foreground/50 font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-archivo text-sm mb-2">
                        Phone Number <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+63 912 345 6789"
                        className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground placeholder:text-foreground/50 font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Information Section */}
              <div>
                <h3 className="text-xl font-mochiy text-primary mb-6">Event Information</h3>

                <div className="space-y-6">
                  {/* Event Type and Number of Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-foreground font-archivo text-sm mb-2">
                        Event Type <span className="text-destructive">*</span>
                      </label>
                      <select
                        aria-label="Event Type"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer"
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="graduation">Graduation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-foreground font-archivo text-sm mb-2">
                        Number of Guests <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        name="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        placeholder="e.g., 50"
                        className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground placeholder:text-foreground/50 font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-foreground font-archivo text-sm mb-2">
                      Event Date <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50 flex items-center justify-between"
                      >
                        <span>{formData.eventDate || "Pick a date"}</span>
                        <Calendar className="w-5 h-5 text-foreground/50" />
                      </button>

                      {showCalendar && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl p-3 z-50 w-full md:w-80">
                          {/* Month Navigation */}
                          <div className="flex items-center justify-between mb-3">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="px-2 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground font-semibold transition-all text-xs"
                            >
                              ← Prev
                            </button>
                            <h4 className="text-sm font-mochiy text-primary">{monthName}</h4>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="px-2 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground font-semibold transition-all text-xs"
                            >
                              Next →
                            </button>
                          </div>

                          {/* Weekdays */}
                          <div className="grid grid-cols-7 text-center mb-1.5 font-semibold text-foreground/60 font-archivo text-xs">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <div key={day} className="py-1">
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Calendar Days */}
                          <div className="grid grid-cols-7 gap-0.5 text-xs mb-2">
                            {emptyDays.map((_, i) => (
                              <div key={`empty-${i}`} className="h-7"></div>
                            ))}
                            {days.map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDateClick(day)}
                                disabled={getDateStatus(day) !== "available"}
                                className={`h-7 rounded font-archivo font-medium transition-all duration-200 flex items-center justify-center text-xs ${getDateColor(day)}`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>

                          {/* Legend */}
                          <div className="flex justify-center gap-2 text-xs text-foreground/70 font-archivo mb-2">
                            <div className="flex items-center gap-1">
                              <div className="w-2.5 h-2.5 bg-green-100 rounded"></div>{" "}
                              <span className="hidden sm:inline">Avail</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2.5 h-2.5 bg-yellow-100 rounded"></div>{" "}
                              <span className="hidden sm:inline">Pend</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2.5 h-2.5 bg-red-100 rounded"></div>{" "}
                              <span className="hidden sm:inline">Book</span>
                            </div>
                          </div>

                          {/* Close button */}
                          <button
                            type="button"
                            onClick={() => setShowCalendar(false)}
                            className="w-full px-2 py-1.5 bg-secondary/60 hover:bg-secondary text-foreground rounded-lg font-archivo text-xs transition-all"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Location */}
                  <div>
                    <label className="block text-foreground font-archivo text-sm mb-2">
                      Event Location <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground placeholder:text-foreground/50 font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>

                  {/* Preferred Package */}
                  <div>
                    <label className="block text-foreground font-archivo text-sm mb-2">
                      Preferred Package <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="preferredPackage"
                      value={formData.preferredPackage}
                      readOnly
                      className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none"
                      placeholder="Please select a package from the Packages page"
                    />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-foreground font-archivo text-sm mb-2">
                      Special Requests or Dietary Requirements
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Let us know if you have any special requirements, allergies, or customization requests..."
                      className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground placeholder:text-foreground/50 font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                      rows={5}
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-destructive font-archivo text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-archivo text-sm">
                    Thank you! Your booking request has been submitted successfully. We will contact you within 24 hours
                    to confirm.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 md:py-4 bg-accent text-primary-foreground rounded-lg font-mochiy text-base md:text-lg hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </button>

              {/* Footer Note */}
              <p className="text-center text-foreground/70 text-sm font-archivo">
                <span className="text-destructive">*</span> Required fields. We will contact you within 24 hours to
                confirm your booking.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-primary-foreground py-16 md:py-20 font-archivo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 mb-12 text-center md:text-left">
            <div>
              <Image
                src="/images/eventory.png"
                alt="EvenTory Logo"
                width={160}
                height={60}
                className="mb-3 mx-auto md:mx-0 brightness-0 invert"
              />
              <p className="text-primary-foreground/90 text-sm leading-relaxed">
                Quality Filipino and Bicolano Catering Services
              </p>
            </div>

            <div>
              <h4 className="font-mochiy text-base mb-3 text-primary-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/menu" className="hover:text-primary-foreground/70 transition">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-primary-foreground/70 transition">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="hover:text-primary-foreground/70 transition">
                    Book Now
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="hover:text-primary-foreground/70 transition">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mochiy text-base mb-3 text-primary-foreground">Contact Us</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/90">
                <li>Bicol Region, Philippines</li>
                <li>+63 912 345 6789</li>
                <li>info@eventory.com</li>
              </ul>
            </div>
          </div>

          <hr className="border-primary-foreground/20 mb-6" />

          <div className="text-center text-xs text-primary-foreground/70">© 2025 EvenTory. All rights reserved.</div>
        </div>
      </footer>
    </main>
  )
}
