"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Users, ChefHat, CheckCircle } from "lucide-react"

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
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
              className="text-foreground hover:text-accent transition-colors text-base font-medium opacity-0 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Menu
            </Link>
            <Link
              href="/packages"
              className="text-foreground hover:text-accent transition-colors text-base font-medium opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Packages
            </Link>
            <Link
              href="/book"
              className="text-foreground hover:text-accent transition-colors text-base font-medium opacity-0 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              Book Now
            </Link>
            <Link
              href="/feedback"
              className="text-foreground hover:text-accent transition-colors text-base font-medium opacity-0 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              Feedback
            </Link>
          </nav>

          <div className="hidden md:block opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <Link href="/profile">
              <button className="px-4 py-2 text-accent border border-accent rounded-full hover:bg-accent hover:text-primary-foreground transition-colors text-base font-medium cursor-pointer">
                Profile
              </button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/menu" className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md text-sm">
              Menu
            </Link>
            <Link href="/packages" className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md text-sm">
              Packages
            </Link>
            <Link href="/book" className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md text-sm">
              Book Now
            </Link>
            <Link href="/feedback" className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md text-sm">
              Feedback
            </Link>
            <Link href="/login" className="block">
              <button className="w-full mt-2 px-4 py-2 text-accent border border-accent rounded-full hover:bg-accent hover:text-primary-foreground transition-colors text-sm font-medium">
                Login
              </button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsVisible(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  return (
    <section className="relative w-full pt-20 md:pt-24 pb-12 md:pb-20 overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image src="/images/bg.png" alt="Background" fill className="object-cover" priority />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-end min-h-[600px] md:min-h-[700px]">
        <div className="text-center space-y-6 md:space-y-4 pb-12 md:pb-15">
          <div
            className={`flex justify-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Image src="/images/eventory.png" alt="EvenTory" width={1000} height={800} className="h-30 md:h-40 w-auto md:translate-y-10" />
          </div>

          <p
            className={`text-lg md:text-xl text-foreground font-archivo transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Make Your Event Unforgettable.
          </p>

          <Link href="#availability">
            <button
              className={`px-8 py-3 bg-accent text-primary-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-1000 delay-500 cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Book Now →
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function CheckAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupStatus, setPopupStatus] = useState<"available" | "booked" | "past" | null>(null)
  const [bookedDateKeys, setBookedDateKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await fetch("/api/bookings")
        const json = await res.json()
        if (!res.ok) return

        const bookedKeys = new Set<string>()

        ;(json.bookings || []).forEach((b: any) => {
          // Skip cancelled bookings
          if (b.status === "cancelled") return
          if (!b.event_date) return
          const d = new Date(b.event_date)
          if (isNaN(d.getTime())) return
          const y = d.getFullYear()
          const m = `${d.getMonth() + 1}`.padStart(2, "0")
          const day = `${d.getDate()}`.padStart(2, "0")
          const key = `${y}-${m}-${day}`

          // Mark all non-cancelled bookings (pending, confirmed, completed) as booked
          // since those dates are already taken by users
          bookedKeys.add(key)
        })

        setBookedDateKeys(bookedKeys)
      } catch (e) {
        console.error("Failed to load booked dates", e)
      }
    }

    fetchBookedDates()
  }, [])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null)

  const isDateInPastOrToday = (year: number, month: number, day: number): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(year, month, day)
    checkDate.setHours(0, 0, 0, 0)
    // Return true if the date is today or in the past (including today)
    return checkDate <= today
  }

  const getDateStatus = (day: number): "available" | "booked" | "past" => {
    if (isDateInPastOrToday(currentDate.getFullYear(), currentDate.getMonth(), day)) {
      return "past" // Past dates are unavailable
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
      setSelectedDate(day)
      setPopupStatus(status)
      setShowPopup(true)
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    setShowPopup(false)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    setShowPopup(false)
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const selectedDateFormatted =
    selectedDate !== null
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString("default", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : ""

  return (
    <section id="availability" className="py-16 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-3xl md:text-4xl font-mochiy text-primary mb-3">Check Availability</h2>
          <p className="text-foreground/70 text-base md:text-lg font-archivo">
            Select your desired date from our booking calendar
          </p>
        </div>

        {/* Calendar Container */}
        <div
          className="bg-card rounded-2xl shadow-xl p-6 md:p-10 max-w-3xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s" }}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 rounded-xl bg-secondary/60 hover:bg-secondary text-foreground font-semibold transition-all cursor-pointer"
            >
              ← Prev
            </button>
            <h4 className="text-lg md:text-xl font-mochiy text-primary">{monthName}</h4>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 rounded-xl bg-secondary/60 hover:bg-secondary text-foreground font-semibold transition-all cursor-pointer"
            >
              Next →
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center mb-2 font-semibold text-foreground/60 font-archivo">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-xs md:text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-sm mb-6">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="h-9 md:h-11"></div>
            ))}
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={getDateStatus(day) !== "available"}
                className={`h-9 md:h-11 rounded-lg font-archivo font-medium transition-all duration-200 flex items-center justify-center ${getDateColor(day)} ${
                  selectedDate === day ? "ring-2 ring-primary/70 scale-105" : ""
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs md:text-sm text-foreground/70 font-archivo mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div> Available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div> Booked
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div> Past
            </div>
          </div>

          {/* Popup */}
          {showPopup && selectedDate !== null && (
            <div className="mt-6 p-5 bg-secondary/50 border border-border rounded-xl text-center animate-fade-in">
              <p className="font-archivo text-foreground mb-2">
                <span className="font-mochiy text-primary">{selectedDateFormatted}</span>
              </p>
              <p className="text-green-700 mb-4">✓ This date is available for booking</p>
              <Link href="/book">
                <button className="px-5 py-2.5 bg-accent text-primary-foreground rounded-lg hover:bg-accent/90 transition-all font-medium text-sm cursor-pointer">
                  Book this Date
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-accent text-primary-foreground py-16 md:py-20 font-archivo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 mb-12 text-center md:text-left">
          {/* Brand Section */}
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

          {/* Quick Links */}
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

          {/* Contact Info */}
          <div>
            <h4 className="font-mochiy text-base mb-3 text-primary-foreground">Contact Us</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/90">
              <li>Bicol Region, Philippines</li>
              <li>+63 912 345 6789</li>
              <li>info@eventory.com</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-primary-foreground/20 mb-6" />

        {/* Copyright */}
        <div className="text-center text-xs text-primary-foreground/70">
          © 2025 EvenTory. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    const user = typeof window !== "undefined" ? localStorage.getItem("current_user") : null

    if (!token || !user) {
      router.replace("/login")
      return
    }

    setAuthChecked(true)
  }, [router])

  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/60">Checking authentication...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <CheckAvailability />
      <Footer />
    </main>
  )
}
