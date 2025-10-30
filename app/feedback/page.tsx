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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a rating")
      return
    }
    if (!comments.trim()) {
      setError("Please add feedback text")
      return
    }
    setSubmitted(true)
    setRating(0)
    setComments("")
    setError("")
    setTimeout(() => setSubmitted(false), 3000)
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
                      className="transition-transform duration-200 hover:scale-110"
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
                className="w-full px-6 py-3 md:py-4 bg-accent text-primary-foreground rounded-lg font-mochiy text-base md:text-lg hover:bg-accent/90 transition-colors duration-200"
              >
                Submit Feedback
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
              <div className="bg-card rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow border border-border/50">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-mochiy text-primary">Maria Santos</h3>
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-accent text-lg">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-accent text-sm md:text-base font-archivo">2 days ago</p>
                </div>
                <p className="text-foreground/80 text-base font-archivo italic">
                  Excellent service! The food was delicious and beautifully presented.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow border border-border/50">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-mochiy text-primary">Juan Dela Cruz</h3>
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-accent text-lg">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-accent text-sm md:text-base font-archivo">1 week ago</p>
                </div>
                <p className="text-foreground/80 text-base font-archivo italic">
                  Our wedding was perfect thanks to EvenTory. Highly recommended!
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow border border-border/50">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-mochiy text-primary">Ana Reyes</h3>
                    <div className="flex gap-1 mt-2">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-accent text-lg">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-accent text-sm md:text-base font-archivo">2 weeks ago</p>
                </div>
                <p className="text-foreground/80 text-base font-archivo italic">
                  Great food quality and professional staff. Will definitely book again.
                </p>
              </div>
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