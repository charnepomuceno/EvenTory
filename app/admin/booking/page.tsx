"use client"

import { Search, Eye, CheckCircle, XCircle, LogOut, Users, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function ManageBookings() {
  const [searchQuery, setSearchQuery] = useState("")

  const bookings = [
    {
      id: 1,
      customer: "Maria Santos",
      email: "maria@example.com",
      phone: "+63 912 345 6789",
      eventType: "Wedding",
      guests: 80,
      date: "March 15, 2025",
      location: "Grand Ballroom, Manila Hotel",
      package: "Wedding Elegance Package",
      amount: 45000,
      status: "Pending",
      customMenu: true,
    },
    {
      id: 2,
      customer: "Juan Cruz",
      email: "juan@example.com",
      phone: "+63 923 456 7890",
      eventType: "Birthday Party",
      guests: 40,
      date: "February 20, 2025",
      location: "Private Residence, Quezon City",
      package: "Birthday Celebration Package",
      amount: 18000,
      status: "Confirmed",
      customMenu: false,
    },
    {
      id: 3,
      customer: "Ana Reyes",
      email: "ana@example.com",
      phone: "+63 934 567 8901",
      eventType: "Corporate Event",
      guests: 60,
      date: "December 10, 2024",
      location: "Conference Hall, BGC",
      package: "Corporate Event Package",
      amount: 28000,
      status: "Completed",
      customMenu: false,
    },
  ]

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-700"
      case "Confirmed":
        return "bg-red-100 text-red-700"
      case "Completed":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url(/background.png)",
      }}
    >
      <div className="min-h-screen bg-black/10">
        {/* Navigation Header */}
       <nav className="bg-transparent">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Left: Logo */}
    <div className="flex-shrink-0">
      <Image
        src="/logo.png"
        alt="Eventory Logo"
        width={120}
        height={40}
        className="h-10 w-auto"
      />
    </div>

    {/* Center: Nav Links */}
    <div className="flex items-center gap-8 mx-auto">
      <Link
          href="/admin/booking"
  className="text-gray-700 hover:text-blue-800 font-medium border-2 border-blue-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
>
        Bookings
      </Link>
      <Link href="/admin/items" className="text-gray-700 hover:text-blue-600 font-medium">
        Items
      </Link>
      <Link href="/admin/packages" className="text-gray-700 hover:text-blue-600 font-medium">
        Packages
      </Link>
      <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium">
        Payments
      </Link>
      <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium">
        Feedback
      </Link>
    </div>

    {/* Right: Logout */}
    <div className="flex-shrink-0">
      <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium">
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
            <h1 className="text-4xl font-bold text-red-900 mb-2" style={{ fontFamily: "MochiyPopOne" }}>
              Manage Bookings
            </h1>
            <p className="text-gray-600">Review and manage all catering bookings</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex justify-start">
            <div className="relative bg-white rounded-lg shadow-md w-[550px]">
              <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
            <input
            type="text"
            placeholder="Search by customer name, event, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-black 
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            </div>
          </div>

          {/* All Bookings Table */}
          <div className="bg-white rounded-2xl p-8 shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold text-red-900 mb-2">All Bookings</h2>
            <p className="text-gray-500 mb-6">Click on actions to approve, decline, or view details</p>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Customer</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Event Details</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Date & Location</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Package</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Amount</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-6 px-4">
                      <p className="font-semibold text-gray-900">{booking.customer}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                      <p className="text-sm text-gray-500">{booking.phone}</p>
                      {booking.customMenu && (
                        <span className="inline-block mt-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          Custom Menu
                        </span>
                      )}
                    </td>
                    <td className="py-6 px-4">
  <p className="font-semibold text-red-900">{booking.eventType}</p>
  <p className="text-sm text-gray-500 flex items-center gap-2">
    <Users size={16} className="text-gray-500" />
    {booking.guests} guests
  </p>
</td>

<td className="py-6 px-4">
  <p className="text-sm text-gray-900 flex items-center gap-2">
    <Calendar size={16} className="text-gray-500" />
    {booking.date}
  </p>
  <p className="text-sm text-gray-500 flex items-center gap-2">
    <MapPin size={16} className="text-gray-500" />
    {booking.location}
  </p>
                    </td>
                    <td className="py-6 px-4">
                      <p className="text-sm text-red-900 font-medium">{booking.package}</p>
                    </td>
                    <td className="py-6 px-4">
                      <p className="font-bold text-red-900">₱{booking.amount.toLocaleString()}</p>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-6 px-4">
  <div className="flex items-center gap-3">
    {booking.status === "Pending" ? (
      <>
        <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition">
          <CheckCircle size={18} />
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition">
          <XCircle size={18} />
        </button>
        <button className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-full transition">
          <Eye size={18} />
        </button>
      </>
    ) : (
      <button className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-full transition">
        <Eye size={18} />
      </button>
    )}
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No bookings found matching your search.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
