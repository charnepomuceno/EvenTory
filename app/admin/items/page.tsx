"use client";

import { Search, Pencil, Trash2, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ManageMenuItems() {
  const [searchQuery, setSearchQuery] = useState("");

  const items = [
    { id: 1, name: "Bicol Express", category: "Main Dish", cost: 200, price: 350, profit: 150, status: "Available" },
    { id: 2, name: "Laing", category: "Main Dish", cost: 150, price: 280, profit: 130, status: "Available" },
    { id: 3, name: "Leche Flan", category: "Dessert", cost: 100, price: 180, profit: 80, status: "Available" },
    { id: 4, name: "Buko Juice", category: "Beverage", cost: 30, price: 60, profit: 30, status: "Available" },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url(/Background.png)" }}
    >
      <div className="min-h-screen bg-black/10">
        {/* Navigation Header */}
        <nav className="bg-transparent">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/admin">
                <Image src="/logo.png" alt="Eventory Logo" width={120} height={40} className="h-10 w-auto" />
              </Link>
            </div>

            {/* Center Links */}
            <div className="flex items-center gap-8 mx-auto">
              <Link
                href="/admin/booking"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Bookings
              </Link>
              <Link href="/admin/items" className="text-gray-700 hover:text-blue-800 font-medium border-2 border-blue-800 bg-white/80 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition backdrop-blur-sm">
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

            {/* Logout */}
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
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-red-900 mb-2"
              style={{ fontFamily: "MochiyPopOne" }}
            >
              Menu Item Management
            </h1>
            <p className="text-gray-700">Add, edit, or remove menu items</p>
          </div>

          {/* Search + Add */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative bg-white/90 rounded-lg shadow-md w-[550px]">
              <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
              <input
                type="text"
                placeholder="Search items by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black 
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-200/80 hover:bg-blue-300 text-white font-medium px-5 py-3 rounded-lg flex items-center gap-2 transition">
              + Add New Item
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl p-8 shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold text-red-900 mb-2">All Menu Items</h2>
            <p className="text-gray-500 mb-6">
              Manage your catering menu items and pricing
            </p>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600 font-semibold">
                  <th className="py-4 px-4">Item Name</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Cost</th>
                  <th className="py-4 px-4">Selling Price</th>
                  <th className="py-4 px-4">Profit</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-4 px-4">
                      <span className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">₱{item.cost}</td>
                    <td className="py-4 px-4 text-red-800 font-semibold">₱{item.price}</td>
                    <td className="py-4 px-4 text-gray-700">₱{item.profit}</td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <button className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-2 rounded-full transition">
                          <Pencil size={18} />
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items found matching your search.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
