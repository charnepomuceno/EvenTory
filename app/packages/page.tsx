"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { X, Check } from "lucide-react"

interface Package {
  id: string
  name: string
  badge: string
  description: string
  guestRange: string
  mealCourses: string
  priceRange: string
  minPrice: number
  maxPrice: number
  inclusions: string[]
}

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
}

const packages: Package[] = [
  {
    id: "wedding",
    name: "Wedding Elegance Package",
    badge: "Premium",
    description:
      "Create magical memories with our premium wedding catering service featuring traditional Filipino and modern fusion dishes.",
    guestRange: "50-100 guests",
    mealCourses: "5-course meal",
    priceRange: "₱35,000 - ₱50,000",
    minPrice: 35000,
    maxPrice: 50000,
    inclusions: [
      "Welcome drinks and appetizers",
      "Main course buffet with 8 dishes",
      "Dessert station with traditional Filipino sweets",
      "Professional service staff",
      "Elegant table setup and decorations",
      "Complimentary wedding cake",
    ],
  },
  {
    id: "birthday",
    name: "Birthday Celebration Package",
    badge: "Popular",
    description:
      "Make birthdays extra special with our vibrant and delicious party catering featuring Filipino favorites.",
    guestRange: "30-50 guests",
    mealCourses: "3-course meal",
    priceRange: "₱15,000 - ₱25,000",
    minPrice: 15000,
    maxPrice: 25000,
    inclusions: [
      "Party platters and finger foods",
      "Main course buffet with 5 dishes",
      "Dessert selection including leche flan",
      "Beverage station with fresh juices",
      "Festive table decorations",
      "Complimentary birthday cake",
    ],
  },
  {
    id: "corporate",
    name: "Corporate Event Package",
    badge: "Business",
    description:
      "Impress your colleagues and clients with professional catering service perfect for meetings and corporate gatherings.",
    guestRange: "40-80 guests",
    mealCourses: "4-course meal",
    priceRange: "₱20,000 - ₱35,000",
    minPrice: 20000,
    maxPrice: 35000,
    inclusions: [
      "Coffee and snack station",
      "Buffet-style lunch or dinner with 6 dishes",
      "Vegetarian and special diet options",
      "Professional serving staff",
      "Clean and efficient setup",
      "Complimentary coffee and tea service",
    ],
  },
  {
    id: "intimate",
    name: "Intimate Gathering Package",
    badge: "Cozy",
    description:
      "Perfect for small family reunions, baptisms, or intimate celebrations with authentic Bicolano flavors.",
    guestRange: "15-25 guests",
    mealCourses: "3-course meal",
    priceRange: "₱8,000 - ₱12,000",
    minPrice: 8000,
    maxPrice: 12000,
    inclusions: [
      "Welcome snacks and drinks",
      "Home-style buffet with 4 signature dishes",
      "Traditional Bicolano specialties",
      "Dessert platter",
      "Basic table setup",
      "Friendly service staff",
    ],
  },
]

const menuItems: MenuItem[] = [
  {
    id: "bicol-express",
    name: "Bicol Express",
    category: "Main Dishes",
    price: 350,
    description: "Spicy pork in coconut milk with chili peppers",
  },
  {
    id: "laing",
    name: "Laing",
    category: "Main Dishes",
    price: 280,
    description: "Taro leaves cooked in coconut milk with shrimp",
  },
  {
    id: "lechon-kawali",
    name: "Lechon Kawali",
    category: "Main Dishes",
    price: 400,
    description: "Crispy deep-fried pork belly",
  },
  {
    id: "kare-kare",
    name: "Kare-Kare",
    category: "Main Dishes",
    price: 420,
    description: "Oxtail and vegetables in peanut sauce",
  },
  {
    id: "pinakbet",
    name: "Pinakbet",
    category: "Main Dishes",
    price: 250,
    description: "Mixed vegetables with shrimp paste",
  },
  {
    id: "chicken-adobo",
    name: "Chicken Adobo",
    category: "Main Dishes",
    price: 320,
    description: "Chicken marinated in soy sauce and vinegar",
  },
  {
    id: "sinigang",
    name: "Sinigang na Baboy",
    category: "Main Dishes",
    price: 380,
    description: "Pork in tamarind soup",
  },
  {
    id: "pancit-canton",
    name: "Pancit Canton",
    category: "Main Dishes",
    price: 300,
    description: "Stir-fried noodles with vegetables and meat",
  },
]

export default function PackagesPage() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([])
  const [customPrice, setCustomPrice] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleBookNow = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowDetailsModal(true)
  }

  const handleCustomize = (pkg: Package) => {
    setSelectedPackage(pkg)
    const packageMenuItems = menuItems
      .filter((item) => pkg.inclusions.some((incl) => incl.toLowerCase().includes(item.name.toLowerCase())))
      .map((item) => item.id)
    setSelectedMenuItems(packageMenuItems)
    setCustomPrice(pkg.minPrice)
    setShowCustomizeModal(true)
  }

  const handleConfirmPackage = () => {
    if (selectedPackage) {
      const itemsToPass = selectedMenuItems.length > 0 ? selectedMenuItems : []
      const itemNames = itemsToPass.map((id) => menuItems.find((m) => m.id === id)?.name).filter(Boolean)

      sessionStorage.setItem(
        "selectedPackage",
        JSON.stringify({
          name: selectedPackage.name,
          price: customPrice || selectedPackage.minPrice,
          customItems: itemNames.length > 0 ? itemNames : selectedPackage.inclusions,
          isCustomized: selectedMenuItems.length > 0,
        }),
      )
      router.push("/book")
    }
  }

  const handleMenuItemToggle = (itemId: string) => {
    setSelectedMenuItems((prev) => {
      const newItems = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      // Calculate price based on selected items
      const basePrice = selectedPackage?.minPrice || 0
      const additionalPrice = newItems.reduce((sum, id) => {
        const item = menuItems.find((m) => m.id === id)
        return sum + (item?.price || 0)
      }, 0)
      setCustomPrice(basePrice + additionalPrice)
      return newItems
    })
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
              Our Catering Packages
            </h1>
            <p
              className="text-lg md:text-xl text-foreground font-archivo opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Choose from our carefully curated packages or customize one to perfectly match your event
            </p>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="pt-2 pb-20 md:pt-4 md:pb-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="bg-card rounded-2xl shadow-lg overflow-hidden opacity-0 animate-fade-in hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {/* Package Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-mochiy text-primary mb-2">{pkg.name}</h3>
                  <p className="text-foreground/70 text-sm font-archivo mb-4">{pkg.description}</p>

                  {/* Package Details */}
                  <div className="space-y-2 mb-6 text-sm font-archivo text-foreground/80">
                    <div className="flex items-center gap-2">
                      <span className="text-accent">👥</span>
                      <span>{pkg.guestRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-accent">🍽️</span>
                      <span>{pkg.mealCourses}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <p className="text-2xl font-mochiy text-primary">{pkg.priceRange}</p>
                  </div>

                  {/* Included Items */}
                  <div className="mb-6">
                    <h4 className="text-sm font-mochiy text-primary mb-3">Included Items:</h4>
                    <ul className="space-y-2">
                      {pkg.inclusions.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-archivo text-foreground/80">
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {pkg.inclusions.length > 3 && (
                        <li className="text-xs font-archivo text-foreground/60 italic">
                          +{pkg.inclusions.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBookNow(pkg)}
                      className="flex-1 px-4 py-3 bg-accent text-primary-foreground rounded-lg font-mochiy text-sm hover:bg-accent/90 transition-colors duration-200"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => handleCustomize(pkg)}
                      className="flex-1 px-4 py-3 border border-accent text-accent rounded-lg font-mochiy text-sm hover:bg-accent/10 transition-colors duration-200"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-popover border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-mochiy text-primary">{selectedPackage.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-mochiy text-primary mb-3">Package Details</h3>
                <div className="space-y-2 text-sm font-archivo text-foreground/80">
                  <p>
                    <span className="font-semibold">Guest Range:</span> {selectedPackage.guestRange}
                  </p>
                  <p>
                    <span className="font-semibold">Meal Courses:</span> {selectedPackage.mealCourses}
                  </p>
                  <p>
                    <span className="font-semibold">Price Range:</span> {selectedPackage.priceRange}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-mochiy text-primary mb-3">Included Items</h3>
                <ul className="space-y-2">
                  {selectedPackage.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg font-mochiy hover:bg-secondary transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmPackage}
                  className="flex-1 px-4 py-3 bg-accent text-primary-foreground rounded-lg font-mochiy hover:bg-accent/90 transition-colors"
                >
                  Confirm Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCustomizeModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-popover border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-mochiy text-primary">Customize {selectedPackage.name}</h2>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-mochiy text-primary mb-2">Package Inclusions</h3>
                <p className="text-sm font-archivo text-foreground/70 mb-4">
                  This package includes the following items:
                </p>
                <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                  <ul className="space-y-2">
                    {selectedPackage.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-lg font-mochiy text-primary mb-3">Add Extra Menu Items</h3>
                <p className="text-sm font-archivo text-foreground/70 mb-4">
                  Select additional dishes to customize your package:
                </p>
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMenuItems.includes(item.id)}
                        onChange={() => handleMenuItemToggle(item.id)}
                        className="mt-1 w-4 h-4 rounded border-border cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-foreground/70 font-archivo">{item.description}</p>
                        <p className="text-sm font-mochiy text-accent mt-1">₱{item.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm font-archivo text-foreground/70 mb-2">Calculated Price:</p>
                <p className="text-3xl font-mochiy text-primary">₱{customPrice.toLocaleString()}</p>
              </div>

              <div className="pt-4 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg font-mochiy hover:bg-secondary transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmPackage}
                  className="flex-1 px-4 py-3 bg-accent text-primary-foreground rounded-lg font-mochiy hover:bg-accent/90 transition-colors"
                >
                  Confirm Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
