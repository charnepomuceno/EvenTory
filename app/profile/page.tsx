"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { MapPin, Users, Calendar, LogOut } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: "Juan Dela Cruz",
    email: "juan@example.com",
    phone: "+63 912 345 6789",
    memberSince: "January 2024",
  })

  const [editFormData, setEditFormData] = useState(profileData)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleEditProfile = () => {
    setEditFormData(profileData)
    setIsEditDialogOpen(true)
  }

  const handleSaveProfile = () => {
    setProfileData(editFormData)
    setIsEditDialogOpen(false)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    router.push("/login")
  }

  const isActive = (href: string) => pathname === href

  return (
    <main className="min-h-screen bg-background">
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

      <section className="pt-2 pb-20 md:pt-4 md:pb-28 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-base font-medium font-archivo self-start md:self-auto"
              >
                ✎ Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Full Name</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.fullName}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Email</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.email}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Phone</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.phone}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-sm font-archivo mb-1">Member Since</p>
                <p className="text-primary text-lg font-archivo font-semibold">{profileData.memberSince}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-16 md:mb-24 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-mochiy text-primary mb-2">Booking History</h2>
              <p className="text-foreground/70 text-base font-archivo">View your past and upcoming bookings</p>
            </div>

            <div className="space-y-6">
              <div className="border border-border rounded-xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl md:text-2xl font-mochiy text-primary">Wedding</h3>
                      <span className="px-3 py-1 bg-destructive text-primary-foreground rounded-full text-xs font-medium font-archivo">
                        ✓ Confirmed
                      </span>
                    </div>
                    <p className="text-foreground/70 text-sm font-archivo mb-4">Wedding Elegance Package</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>March 15, 2025</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <Users className="w-4 h-4" />
                        <span>80 guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>Grand Ballroom, Manila Hotel</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mochiy text-primary">₱45,000</p>
                    <p className="text-foreground/60 text-sm font-archivo">Paid: ₱20,000</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl md:text-2xl font-mochiy text-primary">Birthday Party</h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium font-archivo">
                        ⏱ Pending
                      </span>
                    </div>
                    <p className="text-foreground/70 text-sm font-archivo mb-4">Birthday Celebration Package</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>February 20, 2025</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <Users className="w-4 h-4" />
                        <span>40 guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>Private Residence, Quezon City</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mochiy text-primary">₱18,000</p>
                    <p className="text-foreground/60 text-sm font-archivo">Paid: ₱0</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl md:text-2xl font-mochiy text-primary">Corporate Event</h3>
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium font-archivo">
                        ✓ Completed
                      </span>
                    </div>
                    <p className="text-foreground/70 text-sm font-archivo mb-4">Corporate Event Package</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>December 10, 2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <Users className="w-4 h-4" />
                        <span>60 guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70 font-archivo text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>Conference Hall, BGC</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mochiy text-primary">₱28,000</p>
                    <p className="text-foreground/60 text-sm font-archivo">Paid: ₱28,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-base font-medium font-archivo flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </section>

      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <h2 className="text-2xl font-mochiy text-primary mb-6">Edit Profile</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-foreground/70 text-sm font-archivo mb-2">Full Name</label>
                <input
                  aria-label="name"
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-foreground/70 text-sm font-archivo mb-2">Email</label>
                <input
                  aria-label="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-foreground/70 text-sm font-archivo mb-2">Phone</label>
                <input
                  aria-label="phone"
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 text-foreground font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors font-archivo"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2 bg-accent text-primary-foreground rounded-lg hover:bg-accent/90 transition-colors font-archivo font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="fixed bottom-6 right-6 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 animate-fade-in">
          <p className="text-green-700 font-archivo text-sm">Profile updated successfully!</p>
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
