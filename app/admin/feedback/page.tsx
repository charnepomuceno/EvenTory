"use client"

import { useState } from "react"
import { Star, Eye, Search, Trash2, EyeOff, LogOut, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
interface Feedback {
  id: number
  name: string
  status: "Visible" | "Hidden"
  eventType: string
  date: string
  rating: number
  text: string
}

const feedbackData: Feedback[] = [
  {
    id: 1,
    name: "Maria Santos",
    status: "Visible",
    eventType: "Wedding Reception",
    date: "Jan 10, 2025",
    rating: 5,
    text: '"Absolutely amazing service! The food was delicious and the presentation was stunning. Our guests couldn\'t stop complimenting the Bicolano dishes."',
  },
  {
    id: 2,
    name: "Juan Dela Cruz",
    status: "Visible",
    eventType: "Corporate Event",
    date: "Jan 5, 2025",
    rating: 5,
    text: '"Professional, timely, and delicious. Our clients were thoroughly impressed with the quality of service and authentic Filipino flavors."',
  },
  {
    id: 3,
    name: "Ana Reyes",
    status: "Visible",
    eventType: "Birthday Party",
    date: "Dec 28, 2024",
    rating: 5,
    text: '"Made my daughter\'s birthday so special! Everyone loved the food, especially the Laing and Bicol Express. Will definitely book again!"',
  },
  {
    id: 4,
    name: "Pedro Garcia",
    status: "Visible",
    eventType: "Baptism",
    date: "Dec 20, 2024",
    rating: 4,
    text: '"Good food and service. The setup was nice but took a bit longer than expected. Overall, satisfied with the experience."',
  },
]

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(feedbackData)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.eventType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalReviews = feedbacks.length
  const averageRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
  const visibleReviews = feedbacks.filter((f) => f.status === "Visible").length

  const handleDelete = (id: number) => {
    setFeedbacks(feedbacks.filter((f) => f.id !== id))
  }

  const handleHide = (id: number) => {
    setFeedbacks(
      feedbacks.map((f) => (f.id === id ? { ...f, status: f.status === "Visible" ? "Hidden" : "Visible" } : f)),
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url(/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
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
        className="text-gray-700 hover:text-blue-600 font-medium"
      >
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
            <Link href="/admin/feedback" className="text-gray-700 hover:text-blue-800 font-medium border-2 border-blue-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition">
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1
              className="text-4xl font-bold text-red-900 mb-2"
              style={{ fontFamily: "MochiyPopOne" }}
            >
              Feedback Management
            </h1>
          <p className="text-gray-600">Review and moderate customer feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Reviews Card */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Total Reviews</h3>
              <Star className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-900">{totalReviews}</p>
          </div>

          {/* Average Rating Card */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Average Rating</h3>
              <TrendingUp className="text-red-700 text-xl" />
            </div>
            <p className="text-4xl font-bold text-red-900">
              {averageRating} <span className="text-lg text-gray-500">/ 5.0</span>
            </p>
          </div>

          {/* Visible Reviews Card */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
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
      placeholder="Search by customer name, event, or email..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black placeholder-gray-500 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
</div>



        {/* All Feedback Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-red-900 mb-2">All Feedback</h2>
          <p className="text-gray-600 mb-6">Manage customer reviews and ratings</p>

          {/* Feedback Items */}
          <div className="space-y-6">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-red-900">{feedback.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
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
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
                  >
                    <EyeOff className="w-4 h-4" />
                    Hide
                  </button>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
