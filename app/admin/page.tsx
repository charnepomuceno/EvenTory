import { Calendar, Users, Star, TrendingUp, Package } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="px-8 py-6">
      {/* Top Header Bar */}
      <div className="bg-transparent border-b border-gray-200/30 px-0 py-6 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-red-900 mb-2 font-mochiy">Admin Dashboard</h2>
          <p className="text-gray-700 mt-1 font-medium">Welcome back! Here's what's happening with your catering business.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Bookings</h3>
            <Calendar className="w-10 h-10 text-red-500 bg-red-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Pending Approvals</h3>
            <Users className="w-10 h-10 text-yellow-500 bg-yellow-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-orange-600 mt-2">Requires attention</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Upcoming Events</h3>
            <TrendingUp className="w-10 h-10 text-blue-500 bg-blue-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <p className="text-sm text-blue-600 mt-2">Next 30 days</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Revenue This Month</h3>
            <div className="w-10 h-10 bg-green-100 text-green-500 p-2 rounded-xl shadow-sm flex items-center justify-center text-lg font-semibold">₱</div>
          </div>
          <p className="text-3xl font-bold text-gray-900">₱485,000</p>
          <p className="text-sm text-green-600 mt-2">+18% from last month</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Average Rating</h3>
            <Star className="w-10 h-10 text-purple-500 bg-purple-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">4.8</p>
          <p className="text-sm text-purple-600 mt-2">Based on 89 reviews</p>
        </div>

        <div className="bg-white/50 shadow-lg rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Customer Satisfaction</h3>
            <Package className="w-10 h-10 text-pink-500 bg-pink-100 p-2 rounded-xl shadow-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-900">96%</p>
          <p className="text-sm text-pink-600 mt-2">+3% improvement</p>
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
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Maria Santos</p>
                <p className="text-sm text-gray-600">Wedding • March 15, 2025</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">Confirmed</span>
                <span className="font-semibold text-gray-900">₱45,000</span>
              </div>
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Juan Cruz</p>
                <p className="text-sm text-gray-600">Birthday • Feb 20, 2025</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">Pending</span>
                <span className="font-semibold text-gray-900">₱18,000</span>
              </div>
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Ana Reyes</p>
                <p className="text-sm text-gray-600">Corporate • March 5, 2025</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">Confirmed</span>
                <span className="font-semibold text-gray-900">₱28,000</span>
              </div>
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Pedro Garcia</p>
                <p className="text-sm text-gray-600">Baptism • Feb 28, 2025</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">Pending</span>
                <span className="font-semibold text-gray-900">₱12,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}