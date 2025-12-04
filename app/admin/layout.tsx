"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Calendar, LogOut, Star, TrendingUp, Package as PackageIcon, Utensils } from "lucide-react"
import AdminGuard from "./AdminGuard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const navItems = [

    { label: "Bookings", href: "/admin/booking", icon: Calendar },
    { label: "Items", href: "/admin/items", icon: Utensils },
    { label: "Packages", href: "/admin/packages", icon: PackageIcon },
    { label: "Payments", href: "/admin/payments", icon: TrendingUp },
    { label: "Feedback", href: "/admin/feedback", icon: Star },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 h-screen sticky top-0 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin">
            <Image src="/images/eventory.png" alt="Eventory" width={180} height={54} className="w-full h-auto mb-2" />
          </Link>
          <p className="text-sm text-gray-500">Admin Portal</p>
        </div>

  <nav className="flex-1 p-6 space-y-3 overflow-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-gray-200">
  <Link
    href="/login"
    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
  >
    <LogOut className="w-5 h-5" />
    Logout
  </Link>
</div>
      </aside>

      <main className="flex-1 overflow-auto relative">
        {/* background overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative z-10">
          <AdminGuard>{children}</AdminGuard>
        </div>
      </main>
    </div>
  )
}
