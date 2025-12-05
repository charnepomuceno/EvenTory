"use client"

import { Calendar, Users, Star, TrendingUp, Package } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type DashboardBooking = {
  id: string
  customer: string
  event_type: string
  event_date: string
  status: string
  price: number
}

type DashboardStats = {
  totalBookings: number
  pendingBookings: number
  upcomingEvents: number
  totalRevenue: number
  averageRating: number
  reviewCount: number
  satisfaction: number
  recentBookings: DashboardBooking[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    upcomingEvents: 0,
    totalRevenue: 0,
    averageRating: 0,
    reviewCount: 0,
    satisfaction: 0,
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)

      const [bookingsRes, paymentsRes, feedbackRes] = await Promise.all([
        fetch("/api/bookings?isAdmin=true"),
        fetch("/api/payments"),
        fetch("/api/feedback?status=Visible"),
      ])

      const [bookingsJson, paymentsJson, feedbackJson] = await Promise.all([
        bookingsRes.json(),
        paymentsRes.json(),
        feedbackRes.json(),
      ])

      const bookings = Array.isArray(bookingsJson.bookings) ? bookingsJson.bookings : []
      const payments = Array.isArray(paymentsJson) ? paymentsJson : []
      const feedback = Array.isArray(feedbackJson) ? feedbackJson : []

      const totalBookings = bookings.length
      const pendingBookings = bookings.filter((b: any) => b.status === "pending").length

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcomingEvents = bookings.filter((b: any) => {
        if (!b.event_date) return false
        const d = new Date(b.event_date)
        if (isNaN(d.getTime())) return false
        d.setHours(0, 0, 0, 0)
        return d >= today
      }).length

      const totalRevenue = payments.reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0)

      const reviewCount = feedback.length
      const averageRating =
        reviewCount > 0
          ? feedback.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / reviewCount
          : 0
      const goodReviews =
        reviewCount > 0 ? feedback.filter((f: any) => (f.rating || 0) >= 4).length : 0
      const satisfaction = reviewCount > 0 ? Math.round((goodReviews / reviewCount) * 100) : 0

      const recentBookings: DashboardBooking[] = bookings.slice(0, 4).map((b: any) => ({
        id: b.id,
        customer: b.full_name,
        event_type: b.event_type,
        event_date: b.event_date,
        status: b.status,
        price: b.price || 0,
      }))

      setStats({
        totalBookings,
        pendingBookings,
        upcomingEvents,
        totalRevenue,
        averageRating,
        reviewCount,
        satisfaction,
        recentBookings,
      })
    } catch (e) {
      console.error("Failed to load admin dashboard data", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 15000) 
    return () => clearInterval(interval)
  }, [])

  const roundedAverageRating = useMemo(
    () => (stats.averageRating ? Number(stats.averageRating.toFixed(1)) : 0),
    [stats.averageRating],
  )

  return (
    <div className="px-8 py-6">
      {/* Top Header Bar */}
      <div className="bg-transparent border-b border-gray-200/30 px-0 py-6 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-red-900 mb-2 font-mochiy">Admin Dashboard</h2>
          <p className="text-gray-700 mt-1 font-medium">
            Welcome back! Here's what's happening with your catering business.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Bookings</h3>
            <Calendar className="w-10 h-10 text-red-500 bg-red-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "—" : stats.totalBookings}
          </p>
          <p className="text-sm text-green-600 mt-2">All time</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Pending Approvals</h3>
            <Users className="w-10 h-10 text-yellow-500 bg-yellow-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "—" : stats.pendingBookings}
          </p>
          <p className="text-sm text-orange-600 mt-2">Awaiting confirmation</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Upcoming Events</h3>
            <TrendingUp className="w-10 h-10 text-blue-500 bg-blue-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "—" : stats.upcomingEvents}
          </p>
          <p className="text-sm text-blue-600 mt-2">From today onward</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Revenue</h3>
            <div className="w-10 h-10 bg-green-100 text-green-500 p-2 rounded-xl shadow-sm flex items-center justify-center text-lg font-semibold">
              ₱
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "—" : `₱${stats.totalRevenue.toLocaleString()}`}
          </p>
          <p className="text-sm text-green-600 mt-2">Sum of all recorded payments</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Average Rating</h3>
            <Star className="w-10 h-10 text-purple-500 bg-purple-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "—" : `${roundedAverageRating.toFixed(1)}`}
          </p>
          <p className="text-sm text-purple-600 mt-2">
            Based on {loading ? "—" : stats.reviewCount} reviews
          </p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Customer Satisfaction</h3>
            <Package className="w-10 h-10 text-pink-500 bg-pink-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "—" : `${stats.satisfaction}%`}
          </p>
          <p className="text-sm text-pink-600 mt-2">Ratings 4★ and above</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="px-8 pb-8 relative z-10">
        <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/80">
            <h3 className="text-lg font-bold text-red-900 mb-2">Recent Bookings</h3>
            <p className="text-sm text-gray-600">Latest booking requests and confirmations</p>
          </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-6 py-6 text-center text-gray-500">Loading bookings...</div>
              ) : stats.recentBookings.length === 0 ? (
                <div className="px-6 py-6 text-center text-gray-500">No bookings yet.</div>
              ) : (
                stats.recentBookings.map((b) => (
                  <div key={b.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{b.customer}</p>
                      <p className="text-sm text-gray-600">
                        {b.event_type} • {b.event_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : b.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                      <span className="font-semibold text-gray-900">₱{(b.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
