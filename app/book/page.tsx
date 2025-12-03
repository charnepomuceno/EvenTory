"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Calendar } from "lucide-react"

export default function BookPage() {
  const pathname = usePathname()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const [showCalendar, setShowCalendar] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(null)
  const [bookedDateKeys, setBookedDateKeys] = useState<Set<string>>(new Set())

  const [selectedPackageInfo, setSelectedPackageInfo] = useState<any>(null)
  const [packages, setPackages] = useState<any[]>([])
  const [isLoadingPackages, setIsLoadingPackages] = useState(false)

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
    paymentMethod: "",
  })

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    const user = typeof window !== "undefined" ? localStorage.getItem("current_user") : null

    if (!token || !user) {
      router.replace("/login")
      return
    }

    setAuthChecked(true)
  }, [router])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setFormData((prev) => ({
        ...prev,
        fullName: userData.fullName || "",
        phone: userData.phoneNumber || "",
        email: userData.email || "",
      }))
    }

    const packageData = sessionStorage.getItem("selectedPackage")
    let initialSelectedPackage: any = null
    if (packageData) {
      try {
        const parsed = JSON.parse(packageData)
        initialSelectedPackage = parsed
        // Set the preferred package name immediately
        setFormData((prev) => ({
          ...prev,
          preferredPackage: parsed.name,
        }))
      } catch (e) {
        console.error("Error parsing selected package:", e)
      }
    }

    const fetchPackages = async () => {
      try {
        setIsLoadingPackages(true)
        const res = await fetch("/api/packages")
        const data = await res.json()

        if (res.ok && data.success) {
          const activePackages = data.data.filter((pkg: any) => pkg.status === "Active")
          setPackages(activePackages)

          // Sync selected package info with admin-defined packages when possible
          if (initialSelectedPackage) {
            const matched = activePackages.find((pkg: any) => pkg.name === initialSelectedPackage.name)
            if (matched) {
              // Use the matched package from API, but preserve custom price if customized
              setSelectedPackageInfo({
                ...matched,
                price: initialSelectedPackage.isCustomized ? initialSelectedPackage.price : matched.price,
                customItems: initialSelectedPackage.customItems || matched.inclusions,
              })
              // Ensure the formData matches the found package name
              setFormData((prev) => ({
                ...prev,
                preferredPackage: matched.name,
              }))
            } else {
              // If no match found, clear the selection so user can choose
              setSelectedPackageInfo(null)
              setFormData((prev) => ({
                ...prev,
                preferredPackage: "",
              }))
              // Clear sessionStorage if package doesn't exist
              sessionStorage.removeItem("selectedPackage")
            }
          }
        } else {
          console.error("Failed to load packages:", data.error)
          // If API fails, clear the selection
          if (initialSelectedPackage) {
            setSelectedPackageInfo(initialSelectedPackage)
          } else {
            setFormData((prev) => ({
              ...prev,
              preferredPackage: "",
            }))
          }
        }
      } catch (err) {
        console.error("Error loading packages:", err)
        // If error, clear the selection
        if (initialSelectedPackage) {
          setSelectedPackageInfo(initialSelectedPackage)
        } else {
          setFormData((prev) => ({
            ...prev,
            preferredPackage: "",
          }))
        }
      } finally {
        setIsLoadingPackages(false)
      }
    }

    const fetchBookedDates = async () => {
      try {
        const res = await fetch("/api/bookings")
        const json = await res.json()
        if (!res.ok) return

        const keys = new Set<string>()
        ;(json.bookings || []).forEach((b: any) => {
          // Skip cancelled bookings
          if (b.status === "cancelled") return
          if (!b.event_date) return
          const d = new Date(b.event_date)
          if (isNaN(d.getTime())) return
          const y = d.getFullYear()
          const m = `${d.getMonth() + 1}`.padStart(2, "0")
          const day = `${d.getDate()}`.padStart(2, "0")
          keys.add(`${y}-${m}-${day}`)
        })

        setBookedDateKeys(keys)
      } catch (e) {
        console.error("Failed to load booked dates", e)
      }
    }

    fetchPackages()
    fetchBookedDates()

    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Only run once on mount

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

  const getDateStatus = (day: number): "available" | "booked" | "past" => {
    if (isDateInPastOrToday(currentDate.getFullYear(), currentDate.getMonth(), day)) {
      return "past"
    }

    const y = currentDate.getFullYear()
    const m = `${currentDate.getMonth() + 1}`.padStart(2, "0")
    const d = `${day}`.padStart(2, "0")
    const key = `${y}-${m}-${d}`

    if (bookedDateKeys.has(key)) return "booked"
    return "available"
  }

  const getDateColor = (day: number) => {
    const status = getDateStatus(day)
    if (status === "past") return "bg-gray-100 text-gray-400 cursor-not-allowed"
    if (status === "booked") return "bg-red-100 text-red-700 cursor-not-allowed"
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

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
    const guestCount = Number.parseInt(formData.numberOfGuests, 10)
    if (isNaN(guestCount) || guestCount < 30) {
      setError("Number of Guests must be at least 30")
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
      setError("Preferred Package is required. Please select a package.")
      return
    }
    if (!formData.paymentMethod) {
      setError("Payment Method is required")
      return
    }

    setIsSubmitting(true)

    try {
      const storedUser = localStorage.getItem("current_user")
      if (!storedUser) {
        setError("You must be logged in to book")
        setIsSubmitting(false)
        return
      }

      const userData = JSON.parse(storedUser)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          eventType: formData.eventType,
          numberOfGuests: formData.numberOfGuests,
          eventDate: formData.eventDate,
          eventLocation: formData.eventLocation,
          preferredPackage: formData.preferredPackage,
          specialRequests: formData.specialRequests,
          price: selectedPackageInfo?.price?.toString() || "0",
          paymentMethod: formData.paymentMethod || "gcash",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit booking")
        setIsSubmitting(false)
        return
      }

      setIsSubmitting(false)
      setShowSuccessPopup(true)
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
        paymentMethod: "",
      })
      sessionStorage.removeItem("selectedPackage")
      setSelectedPackageInfo(null)
    } catch (error) {
      console.error("Booking submission error:", error)
      setError("Failed to submit booking. Please try again.")
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false)
        router.push("/profile")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessPopup, router])

  const isActive = (href: string) => pathname === href

  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/60">Checking authentication...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/home" className="shrink-0 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
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
                className={`px-4 py-2 rounded-full transition-colors text-base font-medium cursor-pointer ${
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
                    <span className="font-semibold">Price:</span>{" "}
                    {typeof selectedPackageInfo.price === "number"
                      ? `₱${selectedPackageInfo.price.toLocaleString()}`
                      : selectedPackageInfo.price}
                  </p>
                  {selectedPackageInfo.customItems && (
                    <div>
                      <p className="font-semibold mb-2">Additional Items:</p>
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

              <div>
                <h3 className="text-xl font-mochiy text-primary mb-6">Event Information</h3>

                <div className="space-y-6">
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
                        min="30"
                        placeholder="min. 30"
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
                        className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50 flex items-center justify-between cursor-pointer"
                      >
                        <span>{formData.eventDate || "Pick a date"}</span>
                        <Calendar className="w-5 h-5 text-foreground/50" />
                      </button>

                      {showCalendar && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl p-3 z-50 w-full md:w-80">
                          <div className="flex items-center justify-between mb-3">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="px-2 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground font-semibold transition-all text-xs cursor-pointer"
                            >
                              ← Prev
                            </button>
                            <h4 className="text-sm font-mochiy text-primary">{monthName}</h4>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="px-2 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground font-semibold transition-all text-xs cursor-pointer"
                            >
                              Next →
                            </button>
                          </div>

                          <div className="grid grid-cols-7 text-center mb-1.5 font-semibold text-foreground/60 font-archivo text-xs">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <div key={day} className="py-1">
                                {day}
                              </div>
                            ))}
                          </div>

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

                          <button
                            type="button"
                            onClick={() => setShowCalendar(false)}
                            className="w-full px-2 py-1.5 bg-secondary/60 hover:bg-secondary text-foreground rounded-lg font-archivo text-xs transition-all cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

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

                  <div className="relative z-10">
                    <label className="block text-foreground font-archivo text-sm mb-2">
                      Preferred Package <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <select
                        aria-label="Preferred Package"
                        name="preferredPackage"
                        value={formData.preferredPackage || ""}
                        onChange={(e) => {
                          const newValue = e.target.value
                          handleInputChange(e)
                          const selected = packages.find((pkg: any) => pkg.name === newValue) || null
                          setSelectedPackageInfo(selected)
                          // Clear selected package info if user selects empty option
                          if (!newValue) {
                            setSelectedPackageInfo(null)
                            // Clear sessionStorage when user manually changes selection
                            sessionStorage.removeItem("selectedPackage")
                          } else if (selected) {
                            // Update sessionStorage with new selection
                            sessionStorage.setItem(
                              "selectedPackage",
                              JSON.stringify({
                                name: selected.name,
                                price: selected.price,
                                customItems: selected.inclusions || [],
                                isCustomized: false,
                              }),
                            )
                          }
                        }}
                        disabled={isLoadingPackages || packages.length === 0}
                        className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {isLoadingPackages ? "Loading packages..." : packages.length === 0 ? "No packages available" : "Select a package"}
                        </option>
                        {packages.map((pkg: any) => (
                          <option key={pkg._id} value={pkg.name}>
                            {pkg.name} ({pkg.guests}) - {pkg.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!isLoadingPackages && packages.length === 0 && (
                      <p className="mt-1 text-xs text-foreground/60">
                        No packages available yet. Please check again later or contact the administrator.
                      </p>
                    )}
                    {formData.preferredPackage && packages.length > 0 && (
                      <p className="mt-1 text-xs text-foreground/60">
                        You can change the package selection above if needed.
                      </p>
                    )}
                  </div>

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

                  <div>
                    <label className="block text-foreground font-archivo text-sm mb-2">
                      Payment Method <span className="text-destructive">*</span>
                    </label>
                    <select
                      aria-label="Payment Method"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer"
                    >
                      <option value="">Select payment method</option>
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="gcash">GCash</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-destructive font-archivo text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 md:py-4 bg-accent text-primary-foreground rounded-lg font-mochiy text-base md:text-lg hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </button>

              <p className="text-center text-foreground/70 text-sm font-archivo">
                <span className="text-destructive">*</span> Required fields. We will contact you within 24 hours to
                confirm your booking.
              </p>
            </form>
          </div>
        </div>
      </section>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-mochiy text-primary mb-3">Thank You!</h2>
            <p className="text-foreground/70 font-archivo text-base mb-6">
              Your booking request has been submitted successfully. We will contact you within 24 hours to confirm.
            </p>
            <p className="text-foreground/60 font-archivo text-sm">Redirecting to your profile...</p>
          </div>
        </div>
      )}

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
