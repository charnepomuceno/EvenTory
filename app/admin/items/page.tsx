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
  image?: string;
  createdAt?: string;
}

export default function ManageMenuItems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Main Dish", cost: "", price: "", status: "Available" });
  const [formImage, setFormImage] = useState<File | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "Main Dish", cost: "", price: "", status: "Available" });
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editExistingImageUrl, setEditExistingImageUrl] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formImage) {
        alert('Please select an image for the item.');
        return;
      }

      const fd = new FormData();
      fd.append('image', formImage);
      const uploadRes = await fetch('/api/uploads', { method: 'POST', body: fd });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        console.error('Upload failed', uploadJson.error);
        alert('Image upload failed');
        return;
      }

      const body = {
        name: form.name,
        category: form.category,
        cost: Number(form.cost || 0),
        price: Number(form.price || 0),
        status: form.status,
        image: uploadJson.url,
      };

      const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) {
        setShowAdd(false);
        setForm({ name: "", category: "Main Dish", cost: "", price: "", status: "Available" });
        setFormImage(null);
        fetchItems();
      } else {
        console.error(json.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: Item) => {
    setEditingId(item._id)
    setEditForm({ name: item.name, category: item.category, cost: String(item.cost), price: String(item.price), status: item.status })
    setEditExistingImageUrl((item as any).image || "")
    setEditImage(null)
    setShowEdit(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const body: any = {
        name: editForm.name,
        category: editForm.category,
        cost: Number(editForm.cost || 0),
        price: Number(editForm.price || 0),
        status: editForm.status,
      }

      if (editImage) {
        const fd = new FormData();
        fd.append('image', editImage);
        const uploadRes = await fetch('/api/uploads', { method: 'POST', body: fd });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) {
          console.error('Upload failed', uploadJson.error);
          alert('Image upload failed');
          return;
        }

        body.image = uploadJson.url;
      }

      const res = await fetch(`/api/items/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (json.success) {
        setShowEdit(false)
        setEditingId(null)
        setEditImage(null)
        setEditExistingImageUrl("")
        fetchItems()
      } else {
        console.error(json.error)
      }
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Delete this item? This cannot be undone.')
    if (!ok) return
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        fetchItems()
      } else {
        console.error(json.error)
      }
    } catch (e) { console.error(e) }
  }

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
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#669BBC] hover:bg-[#5a87a8] text-white font-medium px-5 py-3 rounded-lg flex items-center gap-2 cursor-pointer"
        >
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
              paginatedItems.map((item) => (
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
                      <button onClick={() => openEdit(item)} className="bg-yellow-50 text-yellow-700 p-2 rounded-full cursor-pointer">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white p-2 rounded-full cursor-pointer">
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

        {/* Pagination */}
        {filteredItems.length > 0 && !loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
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
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Image (required)</label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormImage(e.target.files ? e.target.files[0] : null)}
                  className="border px-3 py-2 rounded w-full"
                />
                {formImage && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(formImage)} alt="preview" className="h-24 rounded object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded cursor-pointer">Create</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleUpdate} className="bg-white rounded-lg p-6 w-[520px]">
            <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="border px-3 py-2 rounded" />
              <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="border px-3 py-2 rounded">
                <option>Main Dish</option>
                <option>Dessert</option>
                <option>Beverage</option>
                <option>Appetizer</option>
                <option>Side Dish</option>
              </select>
              <input required placeholder="Cost" value={editForm.cost} onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })} className="border px-3 py-2 rounded" />
              <input required placeholder="Price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="border px-3 py-2 rounded" />
              <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="border px-3 py-2 rounded">
                <option>Available</option>
                <option>Unavailable</option>
              </select>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Image (leave empty to keep current)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files ? e.target.files[0] : null)}
                  className="border px-3 py-2 rounded w-full"
                />
                <div className="mt-2 flex items-center gap-3">
                  {editImage && (
                    <img src={URL.createObjectURL(editImage)} alt="new preview" className="h-24 rounded object-cover" />
                  )}
                  {!editImage && editExistingImageUrl && (
                    <img src={editExistingImageUrl} alt="current" className="h-24 rounded object-cover" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded cursor-pointer">Save</button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
