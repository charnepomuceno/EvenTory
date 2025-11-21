"use client";

import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  MapPin,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type BookingItem = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  eventType: string;
  guests: number;
  date: string;
  location: string;
  package: string;
  amount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Rejected" | string;
  customMenu?: boolean;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
};

export default function ManageBookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const bookingsRef = useRef(bookings);
  bookingsRef.current = bookings;

  // modals
  const [viewing, setViewing] = useState<BookingItem | null>(null);
  const [confirmDeleteFor, setConfirmDeleteFor] = useState<BookingItem | null>(null);

  // FILTER
  const [filterStatus, setFilterStatus] = useState("All");
  const [openFilter, setOpenFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  const filterOptions = ["All", "Pending", "Confirmed", "Completed", "Rejected"];

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const normalize = (b: any): BookingItem => ({
    id: b._id ? String(b._id) : String(b.id || Math.random()),
    customer: b.customer,
    email: b.email,
    phone: b.phone,
    eventType: b.eventType,
    guests: b.guests,
    date: b.date,
    location: b.location,
    package: b.package,
    amount: b.amount,
    status: b.status || "Pending",
    customMenu: b.customMenu ?? false,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    notes: b.notes ?? "",
  });

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      const normalized = data.map((b: any) => normalize(b));
      setBookings(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // update status
  const updateStatus = async (id: string, status: string) => {
    const prev = bookingsRef.current;
    setBookings((p) => p.map((b) => (b.id === id ? { ...b, status } : b)));

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();
      setBookings((p) => p.map((b) => (b.id === id ? normalize(data) : b)));
    } catch (err) {
      console.error(err);
      setBookings(prev);
    }
  };

  // delete
  const deleteBooking = async (id: string) => {
    const prev = bookingsRef.current;
    setBookings((p) => p.filter((b) => b.id !== id));

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error(err);
      setBookings(prev);
    }
  };

  const filteredBookings = bookings
    .filter((booking) =>
      [booking.customer, booking.email, booking.eventType]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter((b) => (filterStatus === "All" ? true : b.status === filterStatus));

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 relative z-20 select-none">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-900 mb-2 font-mochiy">Manage Bookings</h1>
        <p className="text-gray-600">Review and manage all catering bookings</p>
      </div>

      {/* Search + Filter */}
      <div className="mb-8 flex items-center justify-start gap-4">

        {/* Search Bar */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-lg shadow-md w-[550px]">
          <Search className="absolute left-4 top-3.5 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search by customer name, event, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-transparent border border-gray-300 text-black placeholder-gray-500 focus:outline-none cursor-text"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setOpenFilter((p) => !p)}
            className="flex items-center justify-between px-4 py-2 bg-white/80 border border-gray-300 rounded-lg shadow-sm hover:bg-white transition min-w-[90px] cursor-pointer"
          >
            {filterStatus}
            <ChevronDown size={18} className="ml-1" />
          </button>

          {openFilter && (
            <div className="absolute top-12 left-0 bg-white shadow-lg rounded-xl border py-2 w-max min-w-[120px] z-20">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFilterStatus(opt);
                    setOpenFilter(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/50 rounded-2xl p-8 shadow-xl overflow-x-auto border-2 border-gray-100">
        <h2 className="text-2xl font-bold text-red-900 mb-2">All Bookings</h2>
        <p className="text-gray-500 mb-6">Click on actions to approve, decline, view details, or delete</p>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">Customer</th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">Event Details</th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">Date & Location</th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">Package</th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">Amount</th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">Status</th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-200">
                {/* Customer */}
                <td className="py-6 px-4 cursor-default">
                  <p className="font-semibold text-gray-900">{booking.customer}</p>
                  <p className="text-sm text-gray-500">{booking.email}</p>
                  <p className="text-sm text-gray-500">{booking.phone}</p>
                  {booking.customMenu && (
                    <span className="inline-block mt-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      Custom Menu
                    </span>
                  )}
                </td>

                {/* Event */}
                <td className="py-6 px-4 cursor-default">
                  <p className="font-semibold text-red-900">{booking.eventType}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    {booking.guests} guests
                  </p>
                </td>

                {/* Date + Location */}
                <td className="py-6 px-4 cursor-default">
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" /> {booking.date}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" /> {booking.location}
                  </p>
                </td>

                {/* Package */}
                <td className="py-6 px-4 cursor-default">
                  <p className="text-sm text-red-900 font-medium">{booking.package}</p>
                </td>

                {/* Amount */}
                <td className="py-6 px-4 cursor-default">
                  <p className="font-bold text-red-900">₱{booking.amount?.toLocaleString()}</p>
                </td>

                {/* Status */}
                <td className="py-6 px-4 cursor-default">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    {booking.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, "Confirmed")}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>

                        <button
                          onClick={() => updateStatus(booking.id, "Rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full cursor-pointer"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>

                        <button
                          onClick={() => setViewing(booking)}
                          className="bg-amber-100 text-amber-700 p-2 rounded-full cursor-pointer"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setViewing(booking)}
                          className="bg-amber-100 text-amber-700 p-2 rounded-full cursor-pointer"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => setConfirmDeleteFor(booking)}
                          className="bg-red-100 hover:bg-red-200 p-2 rounded-full cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewing(null)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-xl w-[600px] max-w-full z-10">
            <h3 className="text-xl font-semibold mb-4">Booking Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{viewing.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{viewing.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{viewing.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">{viewing.guests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Event</p>
                <p className="font-medium">{viewing.eventType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{viewing.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{viewing.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">₱{viewing.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{viewing.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Custom Menu</p>
                <p className="font-medium">{viewing.customMenu ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2 rounded-lg border cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmDeleteFor(null)}
          />
          <div className="relative bg-white rounded-2xl p-6 shadow-xl w-[420px] max-w-full z-10">
            <h3 className="text-xl font-semibold mb-2">Delete Booking?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to permanently delete this booking?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteFor(null)}
                className="px-4 py-2 rounded-lg border cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteBooking(confirmDeleteFor.id);
                  setConfirmDeleteFor(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
