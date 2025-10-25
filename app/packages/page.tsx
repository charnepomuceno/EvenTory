"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

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
              <button className="px-4 py-2 text-accent border border-accent rounded-full hover:bg-accent hover:text-primary-foreground transition-colors text-base font-medium">
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

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-mochiy text-primary mb-8">Our Packages</h1>
        <p className="text-foreground/70 font-archivo">Packages page coming soon...</p>
      </div>
    </main>
  )
}
