"use client"

import { Search, Eye, CheckCircle, XCircle, Users, Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

type Booking = {
  _id: string
  full_name: string
  email: string
  phone: string
  event_type: string
  number_of_guests: number
  event_date: string
  event_location: string
  preferred_package: string
  status: string
  price: string | number
  customMenu?: boolean
}

export default function ManageBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/bookings?isAdmin=true")
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch bookings")
        }
        setBookings(data.bookings || [])
      } catch (err: any) {
        setError(err.message || "Error fetching bookings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.event_type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || ""
    switch (statusLower) {
      case "pending":
        return "bg-blue-100 text-blue-700"
      case "confirmed":
        return "bg-red-100 text-red-700"
      case "completed":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-20">
        <h1 className="text-4xl font-bold text-red-900 mb-8 font-mochiy">Manage Bookings</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading bookings...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-20">
        <h1 className="text-4xl font-bold text-red-900 mb-8 font-mochiy">Manage Bookings</h1>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 relative z-20">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-900 mb-2 font-mochiy">Manage Bookings</h1>
        <p className="text-gray-600">Review and manage all catering bookings</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-start">
        <div className="relative bg-white/80 backdrop-blur-md rounded-lg shadow-md w-[550px]">
          <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search by customer name, event, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black placeholder-gray-500 
      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white/50 rounded-2xl p-8 shadow-xl overflow-x-auto border-2 border-gray-100">
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
              <tr key={booking._id} className="border-b border-gray-200">
                <td className="py-6 px-4">
                  <p className="font-semibold text-gray-900">{booking.full_name}</p>
                  <p className="text-sm text-gray-500">{booking.email}</p>
                  <p className="text-sm text-gray-500">{booking.phone}</p>
                  {booking.customMenu && (
                    <span className="inline-block mt-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      Custom Menu
                    </span>
                  )}
                </td>
                <td className="py-6 px-4">
                  <p className="font-semibold text-red-900">{booking.event_type}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    {booking.number_of_guests} guests
                  </p>
                </td>

                <td className="py-6 px-4">
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    {booking.event_date}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    {booking.event_location}
                  </p>
                </td>
                <td className="py-6 px-4">
                  <p className="text-sm text-red-900 font-medium">{booking.preferred_package}</p>
                </td>
                <td className="py-6 px-4">
                  <p className="font-bold text-red-900">₱{Number(booking.price).toLocaleString()}</p>
                </td>
                <td className="py-6 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status || "Pending"}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    {booking.status?.toLowerCase() === "pending" ? (
                      <>
                        <button className="bg-green-500 text-white p-2 rounded-full">
                          <CheckCircle size={18} />
                        </button>
                        <button className="bg-red-600 text-white p-2 rounded-full">
                          <XCircle size={18} />
                        </button>
                        <button className="bg-amber-100 text-amber-700 p-2 rounded-full">
                          <Eye size={18} />
                        </button>
                      </>
                    ) : (
                      <button className="bg-amber-100 text-amber-700 p-2 rounded-full">
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
  )
}
