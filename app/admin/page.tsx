import { Calendar, Users, Star, TrendingUp, Package, LogOut } from "lucide-react"

import Link from "next/link"
import Image from "next/image"

export default function AdminDashboard() {
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

    {/* Center: Navigation Links */}
    <div className="flex items-center gap-8 mx-auto">
      <Link href="/admin/booking" className="text-gray-700 hover:text-blue-600 font-medium">
        Bookings
      </Link>
      <Link href="/admin/items" className="text-gray-700 hover:text-blue-600 font-medium">
        Items
      </Link>
      <Link href="/admin/packages" className="text-gray-700 hover:text-blue-600 font-medium">
        Packages
      </Link>
      <Link href="/admin/payments" className="text-gray-700 hover:text-blue-600 font-medium">
        Payments
      </Link>
      <Link href="/admin/feedback" className="text-gray-700 hover:text-blue-600 font-medium">
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
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-red-900 mb-2" style={{ fontFamily: "MochiyPopOne" }}>
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your catering business.</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Bookings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-900 font-semibold text-sm">Total Bookings</p>
                </div>
                <Calendar className="text-red-700" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-red-900 mb-2">156</h3>
              <p className="text-gray-500 text-sm">+12% from last month</p>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-900 font-semibold text-sm">Pending Approvals</p>
                </div>
                <Package className="text-blue-800" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-red-900 mb-2">8</h3>
              <p className="text-gray-500 text-sm">Requires attention</p>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-900 font-semibold text-sm">Upcoming Events</p>
                </div>
                <Users className="text-gray-600" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-red-900 mb-2">23</h3>
              <p className="text-gray-500 text-sm">Next 30 days</p>
            </div>

            {/* Revenue This Month */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-900 font-semibold text-sm">Revenue This Month</p>
                </div>
                <span className="text-red-700 text-2xl font-bold">₱</span>
              </div>
              <h3 className="text-4xl font-bold text-red-900 mb-2">485,000</h3>
              <p className="text-gray-500 text-sm">+18% from last month</p>
            </div>

            {/* Average Rating */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-900 font-semibold text-sm">Average Rating</p>
                </div>
                <Star className="text-blue-800" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-red-900 mb-2">4.8</h3>
              <p className="text-gray-500 text-sm">Based on 89 reviews</p>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-900 font-semibold text-sm">Customer Satisfaction</p>
                </div>
                <TrendingUp className="text-gray-600" size={24} />
              </div>
              <h3 className="text-4xl font-bold text-red-900 mb-2">96%</h3>
              <p className="text-gray-500 text-sm">+3% improvement</p>
            </div>
          </div>

          {/* Recent Bookings Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Recent Bookings</h2>
            <p className="text-gray-500 mb-6">Latest booking requests and confirmations</p>

            <div className="space-y-4">
              {/* Booking Item 1 */}
              <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Maria Santos</p>
                  <p className="text-sm text-gray-500">Wedding • March 15, 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">Confirmed</span>
                  <span className="font-bold text-red-900">₱45,000</span>
                </div>
              </div>

              {/* Booking Item 2 */}
              <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Juan Cruz</p>
                  <p className="text-sm text-gray-500">Birthday • Feb 20, 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">Pending</span>
                  <span className="font-bold text-red-900">₱18,000</span>
                </div>
              </div>

              {/* Booking Item 3 */}
              <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Ana Reyes</p>
                  <p className="text-sm text-gray-500">Corporate • March 5, 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">Confirmed</span>
                  <span className="font-bold text-red-900">₱28,000</span>
                </div>
              </div>

              {/* Booking Item 4 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Pedro Garcia</p>
                  <p className="text-sm text-gray-500">Baptism • Feb 28, 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">Pending</span>
                  <span className="font-bold text-red-900">₱12,000</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
