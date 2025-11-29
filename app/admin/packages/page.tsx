"use client"

import type React from "react"

import { Search, Users, Wallet, Pencil, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

type PackageType = {
  _id: string
  name: string
  tier: string
  status: string
  guests: string
  price: string
  inclusions: string[]
  mainDish: string[]
  appetizer: string[]
  dessert: string[]
  beverage: string[]
  description?: string
}

export default function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [packages, setPackages] = useState<PackageType[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    name: "",
    tier: "",
    status: "Active",
    guests: "",
    price: "",
    inclusions: "",
    mainDish: "",
    appetizer: "",
    dessert: "",
    beverage: "",
    description: "",
  })
  const [showEdit, setShowEdit] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    tier: "",
    status: "Active",
    guests: "",
    price: "",
    inclusions: "",
    mainDish: "",
    appetizer: "",
    dessert: "",
    beverage: "",
    description: "",
  })

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/packages")
      const json = await res.json()
      if (json.success) setPackages(json.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Casual":
      case "Formal":
      case "Social":
      case "Professional":
        return "bg-slate-900 text-white"
      default:
        return "bg-slate-900 text-white"
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = {
        name: form.name,
        tier: form.tier,
        status: form.status,
        guests: form.guests,
        price: form.price,
        inclusions: form.inclusions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        mainDish: form.mainDish
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        appetizer: form.appetizer
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        dessert: form.dessert
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        beverage: form.beverage
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        description: form.description,
      }
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.success) {
        setShowCreate(false)
        setForm({
          name: "",
          tier: "",
          status: "Active",
          guests: "",
          price: "",
          inclusions: "",
          mainDish: "",
          appetizer: "",
          dessert: "",
          beverage: "",
          description: "",
        })
        fetchPackages()
      } else {
        console.error(json.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const openEdit = (pkg: PackageType) => {
    setEditingId(pkg._id)
    setEditForm({
      name: pkg.name,
      tier: pkg.tier,
      status: pkg.status,
      guests: pkg.guests,
      price: pkg.price,
      inclusions: (pkg.inclusions || []).join(", "),
      mainDish: (pkg.mainDish || []).join(", "),
      appetizer: (pkg.appetizer || []).join(", "),
      dessert: (pkg.dessert || []).join(", "),
      beverage: (pkg.beverage || []).join(", "),
      description: pkg.description || "",
    })
    setShowEdit(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const body = {
        name: editForm.name,
        tier: editForm.tier,
        status: editForm.status,
        guests: editForm.guests,
        price: editForm.price,
        inclusions: editForm.inclusions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        mainDish: editForm.mainDish
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        appetizer: editForm.appetizer
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        dessert: editForm.dessert
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        beverage: editForm.beverage
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        description: editForm.description,
      }
      const res = await fetch(`/api/packages/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.success) {
        setShowEdit(false)
        setEditingId(null)
        fetchPackages()
      } else {
        console.error(json.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this package? This cannot be undone.")
    if (!ok) return
    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        fetchPackages()
      } else {
        console.error(json.error)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 relative z-20">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-900 mb-2 font-mochiy">Package Management</h1>
        <p className="text-slate-700">Create and manage catering packages</p>
      </div>

      {/* Search and Create Button */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative bg-white/80 rounded-lg shadow-md w-[550px]">
          <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-200/80 hover:bg-blue-300 text-white font-medium px-5 py-3 rounded-lg flex items-center gap-2"
        >
          + Create New Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div>Loading packages...</div>
        ) : (
          packages
            .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((pkg) => (
              <div key={pkg._id} className="bg-white/50 rounded-2xl p-6 shadow-xl border-2 border-gray-100">
                {/* Header with Title and Status */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-red-900">{pkg.name}</h3>
                  <span className="bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium">{pkg.status}</span>
                </div>

                {/* Tier Badge */}
                <div className="mb-4">
                  <span className={`${getTierColor(pkg.tier)} px-3 py-1 rounded-full text-sm font-medium inline-block`}>
                    {pkg.tier}
                  </span>
                </div>

                {/* Guests and Price */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                    <Users size={18} />
                    <span>{pkg.guests}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                    <Wallet size={18} />
                    <span>{pkg.price}</span>
                  </div>
                </div>

                {/* Included Items */}
                <div className="mb-6">
                  <p className="font-bold text-red-900 mb-3">Inclusions:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.inclusions.map((item, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEdit(pkg)}
                    className="border-2 border-red-700 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Pencil size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Create Package Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleCreate} className="bg-white rounded-lg p-6 w-[640px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Package</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="">Select Tier</option>
                <option>Casual</option>
                <option>Formal</option>
                <option>Social</option>
                <option>Professional</option>
              </select>
              <input
                required
                placeholder="Guests"
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                required
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
                rows={2}
              />
              <input
                placeholder="Inclusions (comma separated)"
                value={form.inclusions}
                onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Main Dish (optional, comma separated)"
                value={form.mainDish}
                onChange={(e) => setForm({ ...form, mainDish: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Appetizer (optional, comma separated)"
                value={form.appetizer}
                onChange={(e) => setForm({ ...form, appetizer: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Dessert (optional, comma separated)"
                value={form.dessert}
                onChange={(e) => setForm({ ...form, dessert: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Beverage (optional, comma separated)"
                value={form.beverage}
                onChange={(e) => setForm({ ...form, beverage: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleUpdate} className="bg-white rounded-lg p-6 w-[640px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Package</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <select
                value={editForm.tier}
                onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="">Select Tier</option>
                <option>Casual</option>
                <option>Formal</option>
                <option>Social</option>
                <option>Professional</option>
              </select>
              <input
                required
                placeholder="Guests"
                value={editForm.guests}
                onChange={(e) => setEditForm({ ...editForm, guests: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                required
                placeholder="Price"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Description (optional)"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
                rows={2}
              />
              <input
                placeholder="Inclusions (optional, comma separated)"
                value={editForm.inclusions}
                onChange={(e) => setEditForm({ ...editForm, inclusions: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Main Dish (optional, comma separated)"
                value={editForm.mainDish}
                onChange={(e) => setEditForm({ ...editForm, mainDish: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Appetizer (optional, comma separated)"
                value={editForm.appetizer}
                onChange={(e) => setEditForm({ ...editForm, appetizer: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Dessert (optional, comma separated)"
                value={editForm.dessert}
                onChange={(e) => setEditForm({ ...editForm, dessert: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <input
                placeholder="Beverage (optional, comma separated)"
                value={editForm.beverage}
                onChange={(e) => setEditForm({ ...editForm, beverage: e.target.value })}
                className="col-span-2 border px-3 py-2 rounded"
              />
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
