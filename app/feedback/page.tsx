"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function FeedbackPage() {
  const pathname = usePathname()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comments, setComments] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setPersonalDetails({
        fullName: userData.fullName || "",
        phone: userData.phoneNumber || "",
        email: userData.email || "",
      })
    }
  }, [])

  const [recentFeedback, setRecentFeedback] = useState<
    { _id: string; name: string; rating: number; text: string; date: string; eventType: string }[]
  >([])
  const [loadingRecent, setLoadingRecent] = useState(false)

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoadingRecent(true)
        const res = await fetch("/api/feedback?status=Visible")
        const json = await res.json()
        if (!res.ok || !Array.isArray(json)) return

        setRecentFeedback(json.slice(0, 5))
      } catch (e) {
        console.error("Failed to load feedback", e)
      } finally {
        setLoadingRecent(false)
      }
    }

    fetchRecent()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (rating === 0) {
      setError("Please select a rating")
      return
    }
    if (!comments.trim()) {
      setError("Please add feedback text")
      return
    }

    try {
      setIsSubmitting(true)

      const today = new Date()
      const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: personalDetails.fullName || "Anonymous",
          eventType: "Customer Feedback",
          date: formattedDate,
          rating,
          text: comments.trim(),
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Failed to submit feedback")
        setIsSubmitting(false)
        return
      }

      // Optimistically add new feedback to recent list
      setRecentFeedback((prev) => [
        {
          _id: json._id || Math.random().toString(),
          name: json.name,
          rating: json.rating,
          text: json.text,
          date: json.date,
          eventType: json.eventType,
        },
        ...prev,
      ])

      setSubmitted(true)
      setRating(0)
      setComments("")
      setError("")
      setIsSubmitting(false)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("Feedback submit error:", err)
      setError("Failed to submit feedback. Please try again.")
      setIsSubmitting(false)
    }
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
              Share Your Feedback
            </h1>
            <p
              className="text-lg md:text-xl text-foreground font-archivo opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Help us improve by sharing your experience with our catering service
            </p>
          </div>
        </div>
      </section>

      <section className="pt-2 pb-20 md:pt-4 md:pb-28 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div
            className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-16 md:mb-24 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-mochiy text-primary mb-2">Rate Your Experience</h2>
              <p className="text-foreground/70 text-base font-archivo">Your feedback helps us serve you better</p>
            </div>

            <div className="mb-10">
              <h3 className="text-xl md:text-2xl font-mochiy text-primary mb-2">Your Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-foreground/60 text-sm mb-1">Full Name</p>
                  <p className="text-primary text-lg font-semibold truncate overflow-hidden">
                    {personalDetails.fullName || "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-foreground/60 text-sm mb-1">Email</p>
                  <p className="text-primary text-lg font-semibold truncate overflow-hidden">
                    {personalDetails.email || "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-foreground/60 text-sm mb-1">Phone</p>
                  <p className="text-primary text-lg font-semibold">
                    {personalDetails.phone || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-foreground font-mochiy mb-4">
                  Overall Rating <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-4 justify-center md:justify-start">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                    >
                      <span
                        className={`text-5xl md:text-6xl transition-all duration-200 ${
                          star <= (hoverRating || rating) ? "text-accent animate-glow-star" : "text-foreground/30"
                        }`}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-foreground font-mochiy mb-3">
                  Your Comments <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us about your experience with our service..."
                  className="w-full px-4 py-3 md:py-4 border border-border rounded-lg bg-secondary/50 text-foreground placeholder:text-foreground/50 font-archivo focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  rows={6}
                />
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-destructive font-archivo text-sm">{error}</p>
                </div>
              )}

              {submitted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-archivo text-sm">
                    Thank you! Your feedback has been submitted successfully.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 md:py-4 bg-accent text-primary-foreground rounded-lg font-mochiy text-base md:text-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>

          <div>
            <div className="text-center mb-12 md:mb-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <h2 className="text-3xl md:text-4xl font-mochiy text-primary mb-3">Recent Reviews</h2>
              <p className="text-foreground/70 text-base md:text-lg font-archivo">
                Read feedback from satisfied customers
              </p>
            </div>

            <div className="space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              {loadingRecent && (
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border/50 text-center text-foreground/60 font-archivo">
                  Loading reviews...
                </div>
              )}

              {!loadingRecent && recentFeedback.length === 0 && (
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border/50 text-center text-foreground/60 font-archivo">
                  No reviews yet. Be the first to leave feedback!
                </div>
              )}

              {!loadingRecent &&
                recentFeedback.map((fb) => (
                  <div
                    key={fb._id}
                    className="bg-card rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow border border-border/50"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-mochiy text-primary">{fb.name}</h3>
                        <div className="flex gap-1 mt-2">
                          {[...Array(fb.rating)].map((_, i) => (
                            <span key={i} className="text-accent text-lg">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-accent text-sm md:text-base font-archivo">{fb.date}</p>
                    </div>
                    <p className="text-foreground/80 text-base font-archivo italic">{fb.text}</p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </section>

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
                <li><Link href="/menu">Menu</Link></li>
                <li><Link href="/packages">Packages</Link></li>
                <li><Link href="/book">Book Now</Link></li>
                <li><Link href="/feedback">Feedback</Link></li>
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

          <div className="text-center text-xs text-primary-foreground/70">
            © 2025 EvenTory. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
