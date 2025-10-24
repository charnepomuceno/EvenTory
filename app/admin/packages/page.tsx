"use client"

import { LogOut, Search, Plus, Users, Wallet, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface Package {
  id: string
  name: string
  tier: string
  status: string
  guests: string
  price: string
  items: string[]
}

const packages: Package[] = [
  {
    id: "1",
    name: "Wedding Elegance Package",
    tier: "Premium",
    status: "Active",
    guests: "50-100 guests",
    price: "₱35,000-₱50,000",
    items: ["Bicol Express", "Laing", "Lechon Kawali", "Kare-Kare", "Leche Flan", "Halo-Halo"],
  },
  {
    id: "2",
    name: "Birthday Celebration Package",
    tier: "Popular",
    status: "Active",
    guests: "30-50 guests",
    price: "₱15,000-₱25,000",
    items: ["Chicken Adobo", "Pancit Canton", "Lumpia Shanghai", "Leche Flan"],
  },
  {
    id: "3",
    name: "Corporate Event Package",
    tier: "Business",
    status: "Active",
    guests: "40-80 guests",
    price: "₱20,000-₱35,000",
    items: ["Pinakbet", "Sinigang na Baboy", "Pancit Canton", "Mixed Desserts"],
  },
]

export default function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium":
      case "Popular":
      case "Business":
        return "bg-slate-900 text-white"
      default:
        return "bg-slate-900 text-white"
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url(/Background.png)",
      }}
    >
      <div className="min-h-screen bg-black/5">
        {/* Navigation Header */}
        <nav className="bg-transparent border-b border-transparent">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Image src="/logo.png" alt="Eventory Logo" width={120} height={40} className="h-10 w-auto" />
            </div>

            {/* Center: Navigation Links */}
            <div className="flex items-center gap-8 mx-auto">
              <Link href="/admin/bookings" className="text-slate-700 hover:text-blue-800 font-medium">
                Bookings
              </Link>
              <Link href="/admin/items" className="text-slate-700 hover:text-blue-800 font-medium">
                Items
              </Link>
              <Link
                href="/admin/packages"
                className="text-slate-700 font-medium border-2 border-blue-800 bg-white/80 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                Packages
              </Link>
              <Link href="#" className="text-slate-700 hover:text-blue-800 font-medium">
                Payments
              </Link>
              <Link href="#" className="text-slate-700 hover:text-blue-800 font-medium">
                Feedback
              </Link>
            </div>

            {/* Right: Logout */}
            <div className="flex-shrink-0">
              <button className="flex items-center gap-2 text-slate-700 hover:text-red-600 font-medium">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-red-900 mb-2"
              style={{ fontFamily: "MochiyPopOne" }}
            >
              Package Management
            </h1>
            <p className="text-slate-700">Create and manage catering packages</p>
          </div>

          {/* Search and Create Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative bg-white/90 rounded-lg shadow-md w-[550px]">
              <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
              <input
                type="text"
                placeholder="Search items by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black 
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-200/80 hover:bg-blue-300 text-white font-medium px-5 py-3 rounded-lg flex items-center gap-2 transition">
              + Create New Package
            </button>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl p-6 shadow-lg">
                {/* Header with Title and Status */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-red-900">{pkg.name}</h3>
                  <span className="bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium">{pkg.status}</span>
                </div>

                {/* Tier Badge */}
                <div className="mb-4">
                  <span
                    className={`${getTierColor(pkg.tier)} px-3 py-1 rounded-full text-sm font-medium inline-block`}
                  >
                    {pkg.tier}
                  </span>
                </div>

                {/* Guests and Price */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
  <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
    <Users size={18} />
    <span>{pkg.guests}</span>
  </div>
  <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
    <Wallet size={18} />
    <span>{pkg.price}</span>
  </div>
</div>


                {/* Included Items */}
                <div className="mb-6">
                  <p className="font-bold text-red-900 mb-3">Included Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="border-2 border-red-700 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition">
                    <Pencil size={18} />
                    Edit
                  </button>
                  <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition">
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
