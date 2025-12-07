"use client"

import { useEffect, useState } from "react"
import { Star, Eye, Search, Trash2, EyeOff, TrendingUp } from "lucide-react"
import Image from "next/image"

interface Feedback {
  id: string
  name: string
  status: "Visible" | "Hidden"
  eventType: string
  date: string
  rating: number
  text: string
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/feedback")
        const json = await res.json()
        if (!res.ok || !Array.isArray(json)) return

        const mapped: Feedback[] = json.map((f: any) => ({
          id: f._id,
          name: f.name,
          status: f.status === "Hidden" ? "Hidden" : "Visible",
          eventType: f.eventType,
          date: f.date,
          rating: f.rating,
          text: f.text,
        }))

        setFeedbacks(mapped)
      } catch (e) {
        console.error("Failed to load feedback", e)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.eventType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const totalReviews = feedbacks.length
  const averageRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0"
  const visibleReviews = feedbacks.filter((f) => f.status === "Visible").length

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to delete feedback")
        return
      }
      setFeedbacks((prev) => prev.filter((f) => f.id !== id))
    } catch (e) {
      console.error("Delete feedback failed", e)
    }
  }

  const handleHide = async (id: string) => {
    const current = feedbacks.find((f) => f.id === id)
    if (!current) return
    const newStatus = current.status === "Visible" ? "Hidden" : "Visible"

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error(json.error || "Failed to update feedback")
        return
      }

      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus as "Visible" | "Hidden" } : f)),
      )
    } catch (e) {
      console.error("Update feedback failed", e)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 relative z-20">
      {/* Page Title */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-red-900 mb-2 font-mochiy">Feedback Management</h1>
          <p className="text-gray-600">Review and moderate customer feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Reviews */}
        <div className="bg-white/50 rounded-lg p-6 shadow-xl border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Total Reviews</h3>
            <Star className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-4xl font-bold text-red-900">{totalReviews}</p>
        </div>

        {/* Average Rating */}
        <div className="bg-white/50 rounded-lg p-6 shadow-xl border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Average Rating</h3>
            <TrendingUp className="text-red-700 text-xl" />
          </div>
          <p className="text-4xl font-bold text-red-900">
            {averageRating} <span className="text-lg text-gray-500">/ 5.0</span>
          </p>
        </div>

        {/* Visible Reviews */}
        <div className="bg-white/50 rounded-lg p-6 shadow-xl border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Visible Reviews</h3>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-red-900">{visibleReviews}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-start">
        <div className="relative bg-white/80 backdrop-blur-md rounded-lg shadow-md w-[550px]">
          <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search by customer name, event, or event type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* All Feedback Section */}
      <div className="bg-white/70 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-900 mb-2">All Feedback</h2>
        <p className="text-gray-600 mb-6">Manage customer reviews and ratings</p>

        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading feedback...</div>
        ) : (
          <div className="space-y-6">
            {paginatedFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-red-900">{feedback.name}</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      feedback.status === "Visible" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {feedback.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{feedback.eventType}</span>
                  <span>•</span>
                  <span>{feedback.date}</span>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(feedback.rating)].map((_, i) => (
                    <span key={i} className="text-red-600 text-lg">
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 italic mb-4">{feedback.text}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleHide(feedback.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors cursor-pointer"
                  >
                    <EyeOff className="w-4 h-4" />
                    {feedback.status === "Visible" ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filteredFeedbacks.length === 0 && (
              <div className="py-8 text-center text-gray-500">No feedback found.</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredFeedbacks.length > 0 && !loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredFeedbacks.length)} of {filteredFeedbacks.length} feedback entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? "bg-red-700 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
