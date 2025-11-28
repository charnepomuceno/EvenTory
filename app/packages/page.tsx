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
                className="bg-card rounded-2xl shadow-lg overflow-hidden opacity-0 animate-fade-in hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {/* Package Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-mochiy text-primary mb-2">{pkg.name}</h3>

                  {/* Package Details */}
                  <div className="space-y-2 mb-6 text-sm font-archivo text-foreground/80">
                    <div className="flex items-center gap-2">
                      <span className="text-accent">👥</span>
                      <span>{pkg.guestRange}</span>
                    </div>
                    {pkg.description && (
                      <div className="flex items-start gap-2">
                        <span className="text-accent">📝</span>
                        <span className="line-clamp-2">{pkg.description}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <p className="text-2xl font-mochiy text-primary">{pkg.priceRange}</p>
                  </div>

                  {/* Inclusions */}
                  <div className="mb-6">
                    <h4 className="text-sm font-mochiy text-primary mb-3">Inclusions:</h4>
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

                  {(pkg.mainDish.length > 0 ||
                    pkg.appetizer.length > 0 ||
                    pkg.dessert.length > 0 ||
                    pkg.beverage.length > 0) && (
                    <div className="mb-6 pb-6 border-t border-border pt-6">
                      <h4 className="text-sm font-mochiy text-primary mb-3">Menu Items:</h4>
                      <div className="space-y-2 text-xs">
                        {pkg.mainDish.length > 0 && (
                          <p>
                            <span className="font-semibold">Main Dish:</span> {pkg.mainDish.join(", ")}
                          </p>
                        )}
                        {pkg.appetizer.length > 0 && (
                          <p>
                            <span className="font-semibold">Appetizer:</span> {pkg.appetizer.join(", ")}
                          </p>
                        )}
                        {pkg.dessert.length > 0 && (
                          <p>
                            <span className="font-semibold">Dessert:</span> {pkg.dessert.join(", ")}
                          </p>
                        )}
                        {pkg.beverage.length > 0 && (
                          <p>
                            <span className="font-semibold">Beverage:</span> {pkg.beverage.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBookNow(pkg)}
                      title="Book this package now"
                      className="flex-1 px-4 py-3 bg-accent text-primary-foreground rounded-lg font-mochiy text-sm hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => handleCustomize(pkg)}
                      title="Customize this package"
                      className="flex-1 px-4 py-3 border border-accent text-accent rounded-lg font-mochiy text-sm hover:bg-accent/10 transition-colors duration-200 cursor-pointer"
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
                title="Close package details modal"
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
                  <div className="space-y-3 text-sm font-archivo">
                    {selectedPackage.mainDish.length > 0 && (
                      <div>
                        <p className="font-semibold text-primary mb-1">Main Dishes:</p>
                        <ul className="space-y-1 ml-4">
                          {selectedPackage.mainDish.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedPackage.appetizer.length > 0 && (
                      <div>
                        <p className="font-semibold text-primary mb-1">Appetizers:</p>
                        <ul className="space-y-1 ml-4">
                          {selectedPackage.appetizer.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedPackage.dessert.length > 0 && (
                      <div>
                        <p className="font-semibold text-primary mb-1">Desserts:</p>
                        <ul className="space-y-1 ml-4">
                          {selectedPackage.dessert.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedPackage.beverage.length > 0 && (
                      <div>
                        <p className="font-semibold text-primary mb-1">Beverages:</p>
                        <ul className="space-y-1 ml-4">
                          {selectedPackage.beverage.map((item, i) => (
                            <li key={i}>• {item}</li>
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
                title="Close customize package modal"
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
                className="h-10 w-auto mb-4"
              />
              <p className="text-sm opacity-90">Your trusted catering partner for unforgettable events.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link href="/menu" className="hover:opacity-100 transition-opacity">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:opacity-100 transition-opacity">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="hover:opacity-100 transition-opacity">
                    Book Now
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <p className="text-sm opacity-90">Email: info@eventory.com</p>
              <p className="text-sm opacity-90">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2025 EvenTory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
