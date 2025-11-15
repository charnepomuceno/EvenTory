"use client";

import { Search, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type Item = {
  _id: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  status: string;
  createdAt?: string;
}

export default function ManageMenuItems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Main Dish", cost: "", price: "", status: "Available" });

  const fetchItems = async (search = "") => {
    setLoading(true);
    try {
      const url = `/api/items${search ? `?search=${encodeURIComponent(search)}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setItems(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name,
        category: form.category,
        cost: Number(form.cost || 0),
        price: Number(form.price || 0),
        status: form.status,
      };
      const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) {
        setShowAdd(false);
        setForm({ name: "", category: "Main Dish", cost: "", price: "", status: "Available" });
        fetchItems();
      } else {
        console.error(json.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 relative z-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-900 mb-2 font-mochiy">Menu Item Management</h1>
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
            onChange={(e) => { setSearchQuery(e.target.value); fetchItems(e.target.value); }}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-200/80 hover:bg-blue-300 text-white font-medium px-5 py-3 rounded-lg flex items-center gap-2">
          + Add New Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/50 rounded-2xl p-8 shadow-xl overflow-x-auto border-2 border-gray-100">
        <h2 className="text-2xl font-bold text-red-900 mb-2">All Menu Items</h2>
        <p className="text-gray-500 mb-6">Manage your catering menu items and pricing</p>

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
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center">Loading...</td></tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-4 px-4">
                    <span className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">₱{item.cost}</td>
                  <td className="py-4 px-4 text-red-800 font-semibold">₱{item.price}</td>
                  <td className="py-4 px-4 text-gray-700">₱{Math.max(0, item.price - item.cost)}</td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{item.status}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <button className="bg-yellow-50 text-yellow-700 p-2 rounded-full">
                        <Pencil size={18} />
                      </button>
                      <button className="bg-red-600 text-white p-2 rounded-full">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your search.</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleCreate} className="bg-white rounded-lg p-6 w-[520px]">
            <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border px-3 py-2 rounded">
                <option>Main Dish</option>
                <option>Dessert</option>
                <option>Beverage</option>
                <option>Appetizer</option>
                <option>Side Dish</option>
              </select>
              <input required placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="border px-3 py-2 rounded" />
              <input required placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border px-3 py-2 rounded" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border px-3 py-2 rounded">
                <option>Available</option>
                <option>Unavailable</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded">Create</button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
