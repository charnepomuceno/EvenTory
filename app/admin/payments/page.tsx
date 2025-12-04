"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, TrendingUp, Calendar } from "lucide-react"
import Image from "next/image"

interface PaymentRow {
  id: string
  customer: string
  event: string
  eventDate: string
  totalAmount: number
  paidAmount: number
  balance: number
  status: "Pending" | "Partially Paid" | "Fully Paid"
  paymentMethod: string
}

export default function PaymentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(false)
  const [editPayment, setEditPayment] = useState<PaymentRow | null>(null)
  const [editTotal, setEditTotal] = useState<string>("")
  const [editPaid, setEditPaid] = useState<string>("")
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/payments")
        const json = await res.json()
        if (!res.ok || !Array.isArray(json)) return

        const mapped: PaymentRow[] = json.map((p: any) => ({
          id: p._id,
          customer: p.customer,
          event: p.event,
          eventDate: p.eventDate,
          totalAmount: p.totalAmount,
          paidAmount: p.paidAmount,
          balance: p.balance,
          status: p.status || "Pending",
          paymentMethod: p.paymentMethod || "gcash",
        }))

        setPayments(mapped)
      } catch (e) {
        console.error("Failed to load payments", e)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const openEdit = (payment: PaymentRow) => {
    setEditPayment(payment)
    setEditTotal(payment.totalAmount.toString())
    setEditPaid(payment.paidAmount.toString())
  }

  const computedNumbers = () => {
    const total = Number(editTotal) || 0
    const paid = Number(editPaid) || 0
    const balance = Math.max(total - paid, 0)
    let status: PaymentRow["status"] = "Pending"
    if (paid <= 0) status = "Pending"
    else if (paid > 0 && paid < total) status = "Partially Paid"
    else if (paid >= total && total > 0) status = "Fully Paid"
    return { total, paid, balance, status }
  }

  const handleSaveEdit = async () => {
    if (!editPayment) return
    const { total, paid, balance, status } = computedNumbers()

    try {
      setSavingEdit(true)
      const res = await fetch(`/api/payments/${editPayment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: total,
          paidAmount: paid,
          balance,
          status,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to update payment")
        setSavingEdit(false)
        return
      }

      setPayments((prev) =>
        prev.map((p) =>
          p.id === editPayment.id
            ? {
                ...p,
                totalAmount: total,
                paidAmount: paid,
                balance,
                status,
              }
            : p,
        ),
      )
      setSavingEdit(false)
      setEditPayment(null)
    } catch (e) {
      console.error("Update payment failed", e)
      setSavingEdit(false)
    }
  }

  const filteredPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [payments, searchQuery],
  )

  const totalRevenue = useMemo(
    () => payments.reduce((sum, p) => sum + p.paidAmount, 0),
    [payments],
  )
  const totalPending = useMemo(
    () => payments.reduce((sum, p) => sum + p.balance, 0),
    [payments],
  )

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 relative z-20">
          {/* Header Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-red-900 mb-2 font-mochiy">Payment Management</h1>
              <p className="text-gray-600">Track and manage all customer payments</p>
            </div>
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
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/50 rounded-2xl p-6 shadow-xl border-2 border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-red-900">₱{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="text-red-900 text-2xl font-bold">₱</div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-6 shadow-xl border-2 border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold text-red-900">{payments.length}</p>
                </div>
                <TrendingUp className="text-gray-400" size={24} />
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-6 shadow-xl border-2 border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Pending Payments</p>
                  <p className="text-3xl font-bold text-red-900">₱{totalPending.toLocaleString()}</p>
                </div>
                <Calendar className="text-gray-400" size={24} />
              </div>
            </div>
          </div>

          {/* Payments Table */}
            <div className="bg-white/50 rounded-2xl p-8 shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold text-red-900 mb-2">All Payments</h2>
            <p className="text-gray-600 text-sm mb-6">View and manage all booking payment records</p>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading payments...</div>
            ) : (
              <>
                <table className="w-full border-separate border-spacing-y-1">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Payment ID</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Event</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Event Date</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Total Amount</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Paid Amount</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Balance</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100">
                        <td className="py-4 px-4 text-red-900 font-semibold">{payment.id}</td>
                        <td className="py-4 px-4 text-gray-900">{payment.customer}</td>
                        <td className="py-4 px-4 text-red-900 font-medium">{payment.event}</td>
                        <td className="py-4 px-4 text-gray-700 flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {payment.eventDate}
                        </td>
                        <td className="py-4 px-4 text-red-900 font-semibold">
                          <button
                            type="button"
                            onClick={() => openEdit(payment)}
                            className="underline decoration-dotted hover:decoration-solid cursor-pointer"
                          >
                            ₱{payment.totalAmount.toLocaleString()}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-green-600 font-semibold">
                          ₱{payment.paidAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-blue-500 font-semibold">
                          ₱{payment.balance.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              payment.status === "Fully Paid"
                                ? "bg-green-600 text-white"
                                : payment.status === "Partially Paid"
                                  ? "bg-slate-700 text-white"
                                  : "bg-red-600 text-white"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {payment.paymentMethod === "credit-card"
                            ? "Credit Card"
                            : payment.paymentMethod === "debit-card"
                              ? "Debit Card"
                              : payment.paymentMethod === "bank-transfer"
                                ? "Bank Transfer"
                                : "GCash"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredPayments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No payments found matching your search.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {editPayment && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-mochiy text-red-900 mb-4">Edit Payment</h2>
                <p className="text-sm text-gray-600 mb-4">
                  {editPayment.customer} • {editPayment.event} • {editPayment.eventDate}
                </p>

                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Total Amount (₱)</label>
                    <input
                      type="number"
                      min={0}
                      value={editTotal}
                      onChange={(e) => setEditTotal(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Paid Amount (₱)</label>
                    <input
                      type="number"
                      min={0}
                      value={editPaid}
                      onChange={(e) => setEditPaid(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    {(() => {
                      const { balance, status } = computedNumbers()
                      return (
                        <>
                          <p>
                            <span className="font-semibold">Balance:</span> ₱{balance.toLocaleString()}
                          </p>
                          <p>
                            <span className="font-semibold">Status:</span> {status}
                          </p>
                        </>
                      )
                    })()}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditPayment(null)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={savingEdit}
                    className="px-4 py-2 text-sm rounded-lg bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
                  >
                    {savingEdit ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
  )
}
