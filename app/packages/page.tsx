"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { X, Check, Users, Wallet } from "lucide-react"

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
  mainDish: string[]
  appetizer: string[]
  dessert: string[]
  beverage: string[]
  status?: string
}

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
}

const apiPackageToUI = (p: any): Package => {
  const priceRange = p.price || ""

  const parseMin = (pr: string) => {
    try {
      const digits = pr.replace(/[^0-9-]/g, "").split("-")
      const num = Number(digits[0]) || 0
      return num
    } catch (e) {
      return 0
    }
  }

  return {
    id: p._id || String(Math.random()),
    name: p.name || "",
    badge: p.tier || p.status || "",
    description: p.description || "",
    guestRange: p.guests || "",
    mealCourses: "",
    priceRange: priceRange,
    minPrice: parseMin(priceRange),
    maxPrice: 0,
    inclusions: Array.isArray(p.inclusions) ? p.inclusions : [],
    mainDish: Array.isArray(p.mainDish) ? p.mainDish : [],
    appetizer: Array.isArray(p.appetizer) ? p.appetizer : [],
    dessert: Array.isArray(p.dessert) ? p.dessert : [],
    beverage: Array.isArray(p.beverage) ? p.beverage : [],
    status: p.status || "Active",
  }
}

const apiMenuItemToUI = (it: any): MenuItem => ({
  id: it._id,
  name: it.name,
  category: it.category,
  price: it.price || 0,
  description: it.description || "",
})

export default function PackagesPage() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([])
  const [customPrice, setCustomPrice] = useState(0)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const [packagesData, setPackagesData] = useState<Package[]>([])
  const [loadingPackages, setLoadingPackages] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingPackages(true)
      try {
        const [pRes, iRes] = await Promise.all([fetch("/api/packages"), fetch("/api/items")])
        const pJson = await pRes.json()
        const iJson = await iRes.json()
        if (pJson.success) {
          setPackagesData((pJson.data || []).map((p: any) => apiPackageToUI(p)))
        }
        if (iJson.success) {
          setMenuItems((iJson.data || []).map((it: any) => apiMenuItemToUI(it)))
        }
      } catch (e) {
        console.error("Failed to load packages/items", e)
      } finally {
        setLoadingPackages(false)
      }
    }

    fetchAll()
  }, [])

  const activePackagesData = packagesData.filter((p) => p.status === "Active")

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

      // Store the full package data for the booking page
      const packageData = {
        name: selectedPackage.name,
        price: customPrice || selectedPackage.minPrice,
        priceRange: selectedPackage.priceRange,
        customItems: itemNames.length > 0 ? itemNames : selectedPackage.inclusions,
        isCustomized: selectedMenuItems.length > 0,
        guestRange: selectedPackage.guestRange,
      }

      sessionStorage.setItem("selectedPackage", JSON.stringify(packageData))
      setShowDetailsModal(false)
      setShowCustomizeModal(false)
      router.push("/book")
    }
  }

  const handleMenuItemToggle = (itemId: string) => {
    setSelectedMenuItems((prev) => {
      const newItems = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Casual":
      case "Formal":
      case "Social":
      case "Professional":
        return "bg-secondary text-primary"
      default:
        return "bg-secondary text-primary"
    }
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
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
            {activePackagesData.map((pkg, index) => (
              <div
                key={pkg.id}
                className="bg-white/50 rounded-2xl p-6 shadow-xl border-2 border-gray-100 opacity-0 animate-fade-in hover:shadow-2xl transition-shadow duration-300"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {/* Header with Title and Tier Badge */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-mochiy text-primary">{pkg.name}</h3>
                  <span className={`${getTierColor(pkg.badge)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {pkg.badge}
                  </span>
                </div>

                {/* Description */}
                {pkg.description && (
                  <div className="mb-4 text-base font-archivo text-primary line-clamp-2">{pkg.description}</div>
                )}

                {/* Guests and Price with Icons */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-primary font-archivo text-base">
                    <Users size={18} />
                    <span>{pkg.guestRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-mochiy text-base">
                    <Wallet size={18} />
                    <span>{pkg.priceRange}</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="mb-6">
                  <p className="font-mochiy text-primary mb-3">Inclusions:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.inclusions.map((item, idx) => (
                      <span key={idx} className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCustomize(pkg)}
                    className="flex-1 px-4 py-2 border-2 border-accent text-accent rounded-lg font-medium hover:text-primary hover:border-primary transition-colors cursor-pointer"
                  >
                    Customize Package
                  </button>
                  <button
                    onClick={() => {
                      // Store package and redirect directly to booking page
                      sessionStorage.setItem(
                        "selectedPackage",
                        JSON.stringify({
                          name: pkg.name,
                          price: pkg.priceRange,
                          customItems: pkg.inclusions,
                          isCustomized: false,
                        }),
                      )
                      router.push("/book")
                    }}
                    className="flex-1 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:text-primary transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... existing modals code ... */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-popover border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-mochiy text-primary">{selectedPackage.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                title="Close package details modal"
                className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
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
                    <span className="font-semibold">Price per Head:</span> {selectedPackage.priceRange}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-mochiy text-primary mb-3">Inclusions</h3>
                <ul className="space-y-2">
                  {selectedPackage.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(selectedPackage.mainDish.length > 0 ||
                selectedPackage.appetizer.length > 0 ||
                selectedPackage.dessert.length > 0 ||
                selectedPackage.beverage.length > 0) && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-mochiy text-primary mb-3">Menu Items</h3>
                  <div className="space-y-4">
                    {selectedPackage.mainDish.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Main Dishes</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.mainDish.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedPackage.appetizer.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Appetizers</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.appetizer.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedPackage.dessert.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Desserts</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.dessert.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedPackage.beverage.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Beverages</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.beverage.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg font-mochiy hover:bg-secondary transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmPackage}
                  className="flex-1 px-4 py-3 bg-accent text-primary-foreground rounded-lg font-mochiy hover:bg-accent/90 transition-colors cursor-pointer"
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
                title="Close customize package modal"
                className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {(selectedPackage.mainDish.length > 0 ||
                selectedPackage.appetizer.length > 0 ||
                selectedPackage.dessert.length > 0 ||
                selectedPackage.beverage.length > 0) && (
                <div>
                  <h3 className="text-lg font-mochiy text-primary mb-4">Package Menu Items</h3>
                  <div className="space-y-4">
                    {selectedPackage.mainDish.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Main Dishes</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.mainDish.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPackage.appetizer.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Appetizers</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.appetizer.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPackage.dessert.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Desserts</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.dessert.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPackage.beverage.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Beverages</h4>
                        <ul className="space-y-2 ml-2">
                          {selectedPackage.beverage.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-archivo text-foreground/80">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-mochiy text-primary mb-3">Add Extra Menu Items</h3>
                <p className="text-sm font-archivo text-foreground/70 mb-4">
                  Select additional dishes to customize your package:
                </p>
                <div className="space-y-4">
                  {["Main Dish", "Appetizer", "Dessert", "Beverage"].map((category) => {
                    const categoryItems = menuItems.filter((item) => item.category === category)
                    if (categoryItems.length === 0) return null

                    const categoryKey = category.toLowerCase().replace(" ", "-") + "s"
                    const isExpanded = expandedCategories.has(categoryKey)

                    return (
                      <div key={category} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(categoryKey)}
                          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors bg-secondary/30 cursor-pointer"
                        >
                          <span className="font-semibold text-primary">{category}s</span>
                          <span className="text-sm text-foreground/70">{isExpanded ? "-" : "+"}</span>
                        </button>
                        {isExpanded && (
                          <div className="p-4 space-y-3 border-t border-border">
                            {categoryItems.map((item) => (
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
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm font-archivo text-foreground/70 mb-2">Calculated Price:</p>
                <p className="text-3xl font-mochiy text-primary">₱{customPrice.toLocaleString()}</p>
              </div>

              <div className="pt-4 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg font-mochiy hover:bg-secondary transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmPackage}
                  className="flex-1 px-4 py-3 bg-accent text-primary-foreground rounded-lg font-mochiy hover:bg-accent/90 transition-colors cursor-pointer"
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
                      <Link href="/login" className="hover:text-primary-foreground/70 transition">
                        Menu
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="hover:text-primary-foreground/70 transition">
                        Packages
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="hover:text-primary-foreground/70 transition">
                        Book Now
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="hover:text-primary-foreground/70 transition">
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
    </main>
  )
}
