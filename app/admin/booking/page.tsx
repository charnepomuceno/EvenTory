"use client"

import { Search, Eye, CheckCircle, XCircle, Users, Calendar, MapPin, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

type AdminBooking = {
  id: string
  customer: string
  email: string
  phone: string
  eventType: string
  guests: number
  date: string
  location: string
  package: string
  amount: number
  status: string
  customMenu?: boolean
}

export default function ManageBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)
  const [detailsActionLoading, setDetailsActionLoading] = useState<"pending" | "complete" | "delete" | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/bookings?isAdmin=true")
        const json = await res.json()

        if (!res.ok) return

        const mapped: AdminBooking[] = (json.bookings || []).map((b: any) => ({
          id: b.id,
          customer: b.full_name,
          email: b.email,
          phone: b.phone,
          eventType: b.event_type,
          guests: b.number_of_guests,
          date: b.event_date,
          location: b.event_location,
          package: b.preferred_package,
          amount: Number(b.price || 0),
          status:
            b.status === "pending"
              ? "Pending"
              : b.status === "confirmed"
                ? "Confirmed"
                : b.status === "cancelled"
                  ? "Cancelled"
                  : "Completed",
          customMenu: false,
        }))

        setBookings(mapped)
      } catch (e) {
        console.error("Failed to load bookings", e)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const refreshSingleBookingInState = (updated: any) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === updated.id
          ? {
              ...b,
              status:
                updated.status === "pending"
                  ? "Pending"
                  : updated.status === "confirmed"
                    ? "Confirmed"
                    : updated.status === "cancelled"
                      ? "Cancelled"
                      : "Completed",
              amount: Number(updated.price || updated.amount || b.amount),
            }
          : b,
      ),
    )
  }

  const handleApprove = async (booking: AdminBooking) => {
    try {
      setActionLoadingId(booking.id)
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to approve booking")
        return
      }
      refreshSingleBookingInState(json.booking)
    } catch (e) {
      console.error("Approve booking failed", e)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDecline = async (booking: AdminBooking) => {
    try {
      setActionLoadingId(booking.id)
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to cancel booking")
        return
      }
      refreshSingleBookingInState(json.booking)
    } catch (e) {
      console.error("Cancel booking failed", e)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleViewDetails = (booking: AdminBooking) => {
    setSelectedBooking(booking)
  }

  const handlePendingFromDetails = async () => {
    if (!selectedBooking) return
    try {
      setDetailsActionLoading("pending")
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending" }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to set pending")
        return
      }
      refreshSingleBookingInState(json.booking)
      setSelectedBooking((prev) => (prev ? { ...prev, status: "Pending" } : prev))
    } catch (e) {
      console.error("Set pending booking failed", e)
    } finally {
      setDetailsActionLoading(null)
    }
  }

  const handleCompleteFromDetails = async () => {
    if (!selectedBooking) return
    try {
      setDetailsActionLoading("complete")
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to complete booking")
        return
      }
      refreshSingleBookingInState(json.booking)
      setSelectedBooking((prev) => (prev ? { ...prev, status: "Completed" } : prev))
    } catch (e) {
      console.error("Complete booking failed", e)
    } finally {
      setDetailsActionLoading(null)
    }
  }

  const handleDeleteFromDetails = async () => {
    if (!selectedBooking) return
    const toDeleteId = selectedBooking.id
    try {
      setDetailsActionLoading("delete")
      const res = await fetch(`/api/bookings/${toDeleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to delete booking")
        return
      }
      setBookings((prev) => prev.filter((b) => b.id !== toDeleteId))
      setSelectedBooking(null)
    } catch (e) {
      console.error("Delete booking failed", e)
    } finally {
      setDetailsActionLoading(null)
    }
  }

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
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 relative z-20">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-red-900 mb-2 font-mochiy">Manage Bookings</h1>
          <p className="text-gray-600">Review and manage all catering bookings</p>
        </div>
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

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading bookings...</div>
        ) : (
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
                <tr key={booking.id} className="border-b border-gray-200">
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
                          <button
                            className="bg-[#95BC66] hover:bg-[#7da655] text-white p-2 rounded-full disabled:opacity-50 cursor-pointer"
                            disabled={actionLoadingId === booking.id}
                            onClick={() => handleApprove(booking)}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            className="bg-[#C1121F] hover:bg-[#9d0e18] text-white p-2 rounded-full disabled:opacity-50 cursor-pointer"
                            disabled={actionLoadingId === booking.id}
                            onClick={() => handleDecline(booking)}
                          >
                            <XCircle size={18} />
                          </button>
                          <button
                            className="bg-amber-100 text-amber-700 p-2 rounded-full cursor-pointer"
                            onClick={() => handleViewDetails(booking)}
                          >
                            <Eye size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          className="bg-amber-100 text-amber-700 p-2 rounded-full cursor-pointer"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found matching your search.</p>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-mochiy text-red-900">Booking Details</h2>
              <button
                aria-label="Close details"
                className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedBooking(null)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-800">Customer</p>
                <p className="text-gray-700">
                  {selectedBooking.customer} ({selectedBooking.email})
                </p>
                <p className="text-gray-500">{selectedBooking.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Event Type</p>
                  <p className="text-gray-700">{selectedBooking.eventType}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Guests</p>
                  <p className="text-gray-700">{selectedBooking.guests}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Date & Location</p>
                <p className="text-gray-700">{selectedBooking.date}</p>
                <p className="text-gray-500">{selectedBooking.location}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Package</p>
                <p className="text-gray-700">{selectedBooking.package}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Amount</p>
                <p className="text-gray-900 font-bold">₱{selectedBooking.amount.toLocaleString()}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={handlePendingFromDetails}
                  disabled={detailsActionLoading === "pending"}
                  className="px-4 py-2 rounded-lg bg-[#669BBC] hover:bg-[#5409a0] text-white disabled:opacity-50 text-sm font-medium cursor-pointer"
                >
                  {detailsActionLoading === "pending" ? "Updating..." : "Mark as Pending"}
                </button>
                <button
                  onClick={handleCompleteFromDetails}
                  disabled={detailsActionLoading === "complete"}
                  className="px-4 py-2 rounded-lg bg-[#95BC66] hover:bg-[#7da655] text-white disabled:opacity-50 text-sm font-medium cursor-pointer"
                >
                  {detailsActionLoading === "complete" ? "Completing..." : "Mark as Completed"}
                </button>
                <button
                  onClick={handleDeleteFromDetails}
                  disabled={detailsActionLoading === "delete"}
                  className="px-4 py-2 rounded-lg bg-[#C1121F] hover:bg-[#9d0e18] text-white disabled:opacity-50 text-sm font-medium cursor-pointer"
                >
                  {detailsActionLoading === "delete" ? "Deleting..." : "Delete Booking"}
                </button>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
