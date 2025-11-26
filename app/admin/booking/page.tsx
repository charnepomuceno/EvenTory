"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, MapPin, Mail, Phone, Package, FileText } from "lucide-react"

interface Booking {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  event_type: string
  number_of_guests: number
  event_date: string
  event_location: string
  preferred_package: string
  special_requests: string
  status: string
  price: string
  paid: string
  created_at: string
  updated_at: string
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all")
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bookings?isAdmin=true")
      const data = await response.json()

      if (response.ok) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    const interval = setInterval(fetchBookings, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const filteredBookings = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "confirmed": return "bg-green-100 text-green-700"
      case "completed": return "bg-blue-100 text-blue-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "⏱ Pending"
      case "confirmed": return "✓ Confirmed"
      case "completed": return "✓ Completed"
      case "cancelled": return "✗ Cancelled"
      default: return status
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  }

  return (
    <div className="px-8 py-6">
      <div className="bg-transparent border-b border-gray-200/30 px-0 py-6 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-red-900 mb-2 font-mochiy">Booking Management</h2>
          <p className="text-gray-700 mt-1 font-medium">View and manage all booking requests</p>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Bookings</h3>
            <Calendar className="w-10 h-10 text-blue-500 bg-blue-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Pending</h3>
            <div className="w-10 h-10 text-yellow-500 bg-yellow-100 p-2 rounded-xl shadow-sm flex items-center justify-center">⏱</div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Confirmed</h3>
            <div className="w-10 h-10 text-green-500 bg-green-100 p-2 rounded-xl shadow-sm flex items-center justify-center">✓</div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Completed</h3>
            <div className="w-10 h-10 text-blue-500 bg-blue-100 p-2 rounded-xl shadow-sm flex items-center justify-center">✓</div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
        </div>
      </div>

      <div className="px-8 pb-8 relative z-10">
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              filter === "all" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              filter === "pending" ? "bg-yellow-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              filter === "confirmed" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              filter === "completed" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              filter === "cancelled" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/80">
            <h3 className="text-lg font-bold text-red-900 mb-2">Booking Requests</h3>
            <p className="text-sm text-gray-600">Manage and update booking statuses</p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No bookings found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{booking.full_name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{booking.event_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₱{booking.price || "0"}</p>
                      <p className="text-sm text-gray-600">Paid: ₱{booking.paid || "0"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{booking.number_of_guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{booking.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{booking.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium mb-3 cursor-pointer"
                  >
                    {expandedBookingId === booking.id ? "Hide Details ▼" : "View Details ▶"}
                  </button>

                  {expandedBookingId === booking.id && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm text-gray-900">{booking.event_location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Package</p>
                          <p className="text-sm text-gray-900">{booking.preferred_package}</p>
                        </div>
                      </div>
                      {booking.special_requests && (
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Special Requests</p>
                            <p className="text-sm text-gray-900">{booking.special_requests}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, "completed")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
