"use client"

import { Search, TrendingUp, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function PaymentManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const payments = [
    {
      id: "BK-001",
      customer: "Maria Santos",
      event: "Wedding",
      eventDate: "March 15, 2025",
      totalAmount: 45000,
      paidAmount: 20000,
      balance: 25000,
      status: "Partially Paid",
      statusColor: "bg-slate-700",
      paymentMethod: "GCash",
      paymentDate: "Jan 15, 2025",
    },
    {
      id: "BK-002",
      customer: "Juan Cruz",
      event: "Birthday Party",
      eventDate: "Feb 20, 2025",
      totalAmount: 18000,
      paidAmount: 0,
      balance: 18000,
      status: "Pending",
      statusColor: "bg-red-600",
      paymentMethod: "-",
      paymentDate: "-",
    },
    {
      id: "BK-003",
      customer: "Ana Reyes",
      event: "Corporate Event",
      eventDate: "Dec 10, 2024",
      totalAmount: 28000,
      paidAmount: 28000,
      balance: 0,
      status: "Fully Paid",
      statusColor: "bg-green-600",
      paymentMethod: "Bank Transfer",
      paymentDate: "Dec 5, 2024",
    },
  ]

  const filteredPayments = payments.filter(
    (payment) =>
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url(/background.png)",
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
                className="text-gray-700 hover:text-blue-800 font-medium"
              >
                Bookings
              </Link>
              <Link href="/admin/items" className="text-gray-700 hover:text-blue-600 font-medium">
                Items
              </Link>
              <Link href="/admin/packages" className="text-gray-700 hover:text-blue-600 font-medium">
                Packages
              </Link>
              <Link
                href="/admin/payments"
                className="text-gray-700 hover:text-blue-800 font-medium border-2 border-blue-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
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
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-red-900 mb-2"
              style={{ fontFamily: "MochiyPopOne" }}
            >
              Payment Management
            </h1>
            <p className="text-gray-600">Track and manage all customer payments</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex justify-start">
            <div className="relative bg-white rounded-lg shadow-md w-[550px]">
              <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
              <input
                type="text"
                placeholder="Search by booking ID, customer, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-black 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-red-900">₱1,245,000</p>
                </div>
                <div className="text-red-900 text-2xl font-bold">₱</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">This Month</p>
                  <p className="text-3xl font-bold text-red-900">₱485,000</p>
                </div>
                <TrendingUp className="text-gray-400" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Pending Payments</p>
                  <p className="text-3xl font-bold text-red-900">₱120,000</p>
                </div>
                <Calendar className="text-gray-400" size={24} />
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl p-8 shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold text-red-900 mb-2">All Payments</h2>
            <p className="text-gray-600 text-sm mb-6">View and manage all booking payment records</p>

            <table className="w-full border-separate border-spacing-y-1">

              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Booking ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Event</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Event Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Total Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Paid Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Balance</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Payment Method</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-red-900 font-semibold">{payment.id}</td>
                    <td className="py-4 px-4 text-gray-900">{payment.customer}</td>
                    <td className="py-4 px-4 text-red-900 font-medium">{payment.event}</td>
                    <td className="py-4 px-4 text-gray-700 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {payment.eventDate}
                    </td>
                    <td className="py-4 px-4 text-red-900 font-semibold">
                      ₱{payment.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-green-600 font-semibold">
                      ₱{payment.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-blue-500 font-semibold">
                      ₱{payment.balance.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
  className={`${payment.statusColor} text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}
>
  {payment.status}
</span>

                    </td>
                    <td className="py-4 px-4 text-gray-700">{payment.paymentMethod}</td>
                    <td className="py-4 px-4 text-gray-700">{payment.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No payments found matching your search.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
