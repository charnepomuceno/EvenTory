"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  badge: string
  image: string
}

const menuData: Record<string, MenuItem[]> = {
  "main-dishes": [
    {
      id: "1",
      name: "Bicol Express",
      description: "Spicy pork in coconut milk with chili peppers",
      price: "₱350",
      badge: "Bicolano Special",
      image: "/bicol-express-pork-coconut-spicy.jpg",
    },
    {
      id: "2",
      name: "Laing",
      description: "Taro leaves cooked in coconut milk with shrimp",
      price: "₱280",
      badge: "Bicolano Special",
      image: "/laing-taro-leaves-coconut-shrimp.jpg",
    },
    {
      id: "3",
      name: "Lechon Kawali",
      description: "Crispy deep-fried pork belly",
      price: "₱400",
      badge: "Filipino Classic",
      image: "/lechon-kawali-crispy-pork-belly.jpg",
    },
    {
      id: "4",
      name: "Kare-Kare",
      description: "Oxtail and vegetables in peanut sauce",
      price: "₱420",
      badge: "Filipino Classic",
      image: "/kare-kare-peanut-sauce-vegetables.jpg",
    },
    {
      id: "5",
      name: "Pinakbet",
      description: "Mixed vegetables with shrimp paste",
      price: "₱250",
      badge: "Filipino Classic",
      image: "/pinakbet-mixed-vegetables-shrimp-paste.jpg",
    },
    {
      id: "6",
      name: "Chicken Adobo",
      description: "Chicken marinated in soy sauce and vinegar",
      price: "₱320",
      badge: "Filipino Classic",
      image: "/chicken-adobo-soy-vinegar.jpg",
    },
    {
      id: "7",
      name: "Sinigang na Baboy",
      description: "Pork in tamarind soup",
      price: "₱380",
      badge: "Filipino Classic",
      image: "/sinigang-pork-tamarind-soup.jpg",
    },
    {
      id: "8",
      name: "Pancit Canton",
      description: "Stir-fried noodles with vegetables and meat",
      price: "₱300",
      badge: "Filipino Classic",
      image: "/pancit-canton-noodles-vegetables.jpg",
    },
  ],
  desserts: [
    {
      id: "d1",
      name: "Halo-Halo",
      description: "Mixed shaved ice with sweet ingredients",
      price: "₱120",
      badge: "Filipino Favorite",
      image: "/halo-halo-shaved-ice-dessert.jpg",
    },
    {
      id: "d2",
      name: "Leche Flan",
      description: "Caramelized custard dessert",
      price: "₱150",
      badge: "Filipino Classic",
      image: "/leche-flan-custard-dessert.jpg",
    },
    {
      id: "d3",
      name: "Ube Cake",
      description: "Purple yam cake with creamy frosting",
      price: "₱200",
      badge: "Filipino Favorite",
      image: "/ube-cake-purple-yam.jpg",
    },
  ],
  beverages: [
    {
      id: "b1",
      name: "Mango Juice",
      description: "Fresh mango juice blend",
      price: "₱80",
      badge: "Tropical Drink",
      image: "/mango-juice-tropical.jpg",
    },
    {
      id: "b2",
      name: "Calamansi Juice",
      description: "Refreshing Filipino citrus juice",
      price: "₱60",
      badge: "Local Favorite",
      image: "/calamansi-juice-citrus.jpg",
    },
    {
      id: "b3",
      name: "Buko Juice",
      description: "Fresh young coconut juice",
      price: "₱70",
      badge: "Tropical Drink",
      image: "/buko-juice-coconut.jpg",
    },
  ],
  appetizers: [
    {
      id: "a1",
      name: "Lumpia",
      description: "Spring rolls with meat and vegetable filling",
      price: "₱180",
      badge: "Filipino Classic",
      image: "/lumpia-spring-rolls.jpg",
    },
    {
      id: "a2",
      name: "Siomai",
      description: "Steamed pork dumplings",
      price: "₱150",
      badge: "Asian Favorite",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "a3",
      name: "Fish Balls",
      description: "Crispy fried fish balls with sauce",
      price: "₱100",
      badge: "Street Food",
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
}

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  return (
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
            <Link href="/profile" className="block">
              <button className="w-full mt-2 px-4 py-2 text-accent border border-accent rounded-full hover:bg-accent hover:text-primary-foreground transition-colors text-sm font-medium cursor-pointer">
                Profile
              </button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

function MenuItem({ item }: { item: MenuItem }) {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50">
      <div className="relative h-48 md:h-56 w-full overflow-hidden bg-secondary">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg md:text-xl font-mochiy text-primary">{item.name}</h3>
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium font-archivo whitespace-nowrap">
            {item.badge}
          </span>
        </div>

        <p className="text-foreground/70 text-sm font-archivo mb-4 line-clamp-2">{item.description}</p>

        <div className="text-destructive text-xl md:text-2xl font-mochiy">{item.price}</div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("main-dishes")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tabs = [
    { id: "main-dishes", label: "Main Dishes" },
    { id: "desserts", label: "Desserts" },
    { id: "beverages", label: "Beverages" },
    { id: "appetizers", label: "Appetizers" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

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
              Our Menu
            </h1>
            <p
              className="text-lg md:text-xl text-foreground font-archivo opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Explore our delicious selection of Filipino and Bicolano dishes
            </p>
          </div>
        </div>
      </section>

      {/* Menu Content */}
      <section className="pt-2 pb-20 md:pt-4 md:pb-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div
            className="flex flex-wrap gap-2 md:gap-3 mb-12 md:mb-16 justify-center opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium transition-all duration-300 font-archivo text-sm md:text-base cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-accent text-primary-foreground shadow-md"
                    : "bg-card border border-border text-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {menuData[activeTab].map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>

          {/* Custom Menu Section */}
          <div
            className="bg-card rounded-2xl shadow-lg p-8 md:p-12 text-center opacity-0 animate-fade-in border border-border/50"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="mb-6 flex justify-center">
              <div className="text-4xl md:text-5xl">🍽️</div>
            </div>

            <h2 className="text-2xl md:text-3xl font-mochiy text-primary mb-3">Need a Custom Menu?</h2>
            <p className="text-foreground/70 text-base md:text-lg font-archivo mb-8 max-w-2xl mx-auto">
              We can create a customized menu tailored to your events needs and preferences
            </p>

            <Link href="/packages">
              <button className="inline-flex items-center gap-2 px-8 py-3 md:py-4 bg-destructive text-primary-foreground rounded-full font-medium hover:bg-destructive/90 transition-colors text-base md:text-lg font-mochiy cursor-pointer">
                🔗 Create a Customized Menu
              </button>
            </Link>
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
