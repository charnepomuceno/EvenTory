"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { MapPin, Users, Calendar } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    email: "",
    memberSince: "",
  })

  const [editFormData, setEditFormData] = useState(profileData)
  const [bookings, setBookings] = useState<any[]>([])
  const pollingRef = useRef<number | null>(null)

  const fetchBookings = async (email: string) => {
    if (!email) return
    try {
      const res = await fetch(`/api/bookings?customer=${encodeURIComponent(email)}`)
      if (!res.ok) {
        console.error("Failed to fetch bookings - status:", res.status)
        return
      }
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching bookings:", err)
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      const today = new Date()
      const memberSince = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

      setProfileData({
        fullName: userData.fullName || "",
        phone: userData.phoneNumber || "",
        email: userData.email || "",
        memberSince: memberSince,
      })
      setEditFormData({
        fullName: userData.fullName || "",
        phone: userData.phoneNumber || "",
        email: userData.email || "",
        memberSince: memberSince,
      })

      // initial fetch
      fetchBookings(userData.email)

      if (pollingRef.current === null) {
        pollingRef.current = window.setInterval(() => {
          fetchBookings(userData.email)
        }, 3000) as unknown as number
      }
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)

    // Listen to storage events
    const handleStorage = (e: StorageEvent) => {
      try {
        if (!e.key) return
        if (e.key === "bookingRequests" || e.key === "selectedPackage" || e.key === "current_user") {
          const stored = localStorage.getItem("current_user")
          if (stored) {
            const userData = JSON.parse(stored)
            fetchBookings(userData.email)
          }
        }
      } catch (err) {
        console.error("storage event handler error:", err)
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", handleStorage)
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEditProfile = () => {
    setEditFormData(profileData)
    setIsEditDialogOpen(true)
  }

  const handleSaveProfile = async () => {
    try {
      const storedUser = localStorage.getItem("current_user")
      if (!storedUser) return

      const userData = JSON.parse(storedUser)
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          fullName: editFormData.fullName,
          email: editFormData.email,
          phoneNumber: editFormData.phone,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setShowSuccessMessage(false)
        return
      }

      localStorage.setItem(
        "current_user",
        JSON.stringify({
          id: data.user.id,
          phoneNumber: data.user.phoneNumber || "",
          fullName: data.user.fullName || "",
          email: data.user.email || "",
        }),
      )

      setProfileData(editFormData)
      setIsEditDialogOpen(false)
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Profile update error:", error)
      setIsEditDialogOpen(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("current_user")
    router.push("/login")
  }

  const handleCancelOrder = (orderId: string) => {
    setCancellingOrderId(orderId)
    setCancelDialogOpen(true)
  }

  const confirmCancelOrder = async () => {
    if (!cancellingOrderId) return
    try {
      const res = await fetch(`/api/bookings/${cancellingOrderId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to cancel booking")

      // After delete, re-fetch to ensure admin & user lists are in sync
      const storedUser = localStorage.getItem("current_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        await fetchBookings(userData.email)
      } else {
        setBookings((prev) => prev.filter((b) => b._id !== cancellingOrderId))
      }

      setCancellingOrderId(null)
      setCancelDialogOpen(false)
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (err) {
      console.error(err)
      setCancelDialogOpen(false)
    }
  }

  const isActive = (href: string) => pathname === href

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "confirmed":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending"
      case "confirmed":
        return "Confirmed"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return "Pending"
    }
  }

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => (b.status || "").toLowerCase() === statusFilter.toLowerCase())

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
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

      {/* HERO */}
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
              My Profile
            </h1>
          </div>
        </div>
      </section>

      {/* ACCOUNT INFO & BOOKINGS */}
      <section className="pt-2 pb-20 md:pt-4 md:pb-28 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ACCOUNT INFO */}
          <div
            className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-16 md:mb-24 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-mochiy text-primary mb-2">Account Information</h2>
                <p className="text-foreground/70 text-base font-archivo">Your personal details</p>
              </div>
              <button
                onClick={handleEditProfile}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-base font-medium font-archivo self-start md:self-auto cursor-pointer"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Full Name</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.fullName}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Phone</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.phone}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Email</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Member Since</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.memberSince}</p>
              </div>
            </div>
          </div>

          {/* BOOKINGS */}
          <div
            className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-16 md:mb-24 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-mochiy text-primary mb-2">Booking History</h2>
                <p className="text-foreground/70 text-base font-archivo">View your past and upcoming bookings</p>
              </div>
              {/* FILTER */}
              <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm font-archivo text-foreground/70">
                  Filter:
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border border-border rounded-lg cursor-pointer text-sm font-archivo"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-border rounded-xl p-6 md:p-8 hover:shadow-md transition-all duration-200 hover:border-accent/30 bg-card"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-mochiy text-primary">{booking.customer}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium font-archivo ${getStatusColor(
                            booking.status,
                          )}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <p className="text-foreground/70 text-sm font-archivo mb-4">{booking.package}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.date ? new Date(booking.date).toLocaleDateString("en-US") : ""}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                          <Users className="w-4 h-4" />
                          <span>{booking.guests ?? ""}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.location ?? ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-mochiy text-primary">₱{booking.amount?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === booking._id ? null : booking._id)}
                      className="text-accent hover:text-accent/80 transition-colors text-sm font-archivo font-medium mb-4 cursor-pointer"
                    >
                      {expandedOrderId === booking._id ? "Hide Details" : "View Details"}
                    </button>

                    {expandedOrderId === booking._id && (
                      <div className="bg-secondary/30 rounded-lg p-4 mb-4 space-y-3">
                        <div>
                          <p className="text-foreground/60 text-xs font-archivo mb-1">Event Type</p>
                          <p className="text-foreground font-archivo text-sm">{booking.eventType}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs font-archivo mb-1">Number of Guests</p>
                          <p className="text-foreground font-archivo text-sm">{booking.guests}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs font-archivo mb-1">Event Date</p>
                          <p className="text-foreground font-archivo text-sm">{booking.date}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs font-archivo mb-1">Event Location</p>
                          <p className="text-foreground font-archivo text-sm">{booking.location}</p>
                        </div>
                      </div>
                    )}

                    {booking.status && booking.status.toLowerCase() === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(booking._id)}
                        className="w-full px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-primary-foreground transition-all duration-200 hover:shadow-lg active:scale-95 text-sm font-medium font-archivo cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-foreground/60 font-archivo">No bookings found</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="px-8 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-primary-foreground transition-colors text-base font-medium font-archivo cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* EDIT PROFILE MODAL */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl shadow-xl p-8 w-[600px] max-w-full">
            <h2 className="text-2xl font-mochiy text-primary mb-6">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/70 font-archivo mb-2">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/70 font-archivo mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/70 font-archivo mb-2">Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 justify-end">
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary/50 transition-colors font-archivo cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-archivo cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL BOOKING CONFIRMATION MODAL */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl shadow-xl p-8 w-[400px] max-w-full">
            <h2 className="text-xl font-mochiy text-primary mb-4">Cancel Booking?</h2>
            <p className="text-foreground/70 font-archivo mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary/50 transition-colors font-archivo cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-6 py-2 bg-destructive text-primary-foreground rounded-lg hover:bg-destructive/90 transition-colors font-archivo cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-lg font-archivo">
          Operation successful!
        </div>
      )}
    </main>
  )
}
