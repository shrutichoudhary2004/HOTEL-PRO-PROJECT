import React, { useEffect, useState } from 'react';
import { analyticsAPI, roomsAPI, bookingsAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import { 
  DollarSign, 
  Bed, 
  Users, 
  Percent, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Hotel
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New room state
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    floor: 1,
    pricePerNight: 250,
    sizeSqFt: 400,
    description: '',
    bedType: 'King Bed',
    amenities: 'High-Speed Wi-Fi, 4K Smart TV, Mini Bar, Marble Bath',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, roomsRes, bookingsRes] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        roomsAPI.getRooms(),
        bookingsAPI.getAllBookings(),
      ]);
      setStats(statsRes.data?.data || null);
      setRooms(roomsRes.data?.data || []);
      setBookings(bookingsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomStatusChange = async (roomId, newStatus) => {
    try {
      await roomsAPI.updateRoom(roomId, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newRoom,
        amenities: newRoom.amenities.split(',').map((s) => s.trim()),
        images: [newRoom.images],
        capacity: { adults: 2, children: 1 },
      };
      await roomsAPI.createRoom(payload);
      setShowAddModal(false);
      setNewRoom({
        roomNumber: '',
        title: '',
        type: 'Deluxe',
        floor: 1,
        pricePerNight: 250,
        sizeSqFt: 400,
        description: '',
        bedType: 'King Bed',
        amenities: 'High-Speed Wi-Fi, 4K Smart TV, Mini Bar, Marble Bath',
        images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        status: 'available',
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create room');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-hotel-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const kpi = stats?.kpi || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-hotel-gold">
            Executive Management Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-hotel-navy mt-1">
            Hotel Operations & Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time occupancy rates, inventory status, guest bookings, and financial performance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-hotel-navy text-white text-xs font-semibold rounded-xl hover:bg-hotel-midnight transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Gross Revenue"
          value={`$${(kpi.totalRevenue || 0).toLocaleString()}`}
          change="Paid transactions"
          isPositive={true}
          icon={DollarSign}
          color="emerald"
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${kpi.occupancyRate || 0}%`}
          change={`${kpi.occupiedRooms || 0} / ${kpi.totalRooms || 0} suites active`}
          isPositive={kpi.occupancyRate > 50}
          icon={Percent}
          color="amber"
        />
        <StatsCard
          title="Available Inventory"
          value={`${kpi.availableRooms || 0} Rooms`}
          change={`${kpi.cleaningRooms || 0} in housekeeping`}
          isPositive={true}
          icon={Bed}
          color="blue"
        />
        <StatsCard
          title="Total Bookings"
          value={`${kpi.totalBookings || 0}`}
          change={`${kpi.arrivalsToday || 0} arrivals today`}
          isPositive={true}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Room Inventory Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-serif text-xl font-bold text-hotel-navy">Room Inventory Grid</h2>
            <p className="text-xs text-slate-400">Directly modify status for front desk & housekeeping synchronization.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{rooms.length} Suites Configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Room #</th>
                <th className="py-3 px-4">Title & Type</th>
                <th className="py-3 px-4">Floor</th>
                <th className="py-3 px-4">Rate / Night</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((room) => (
                <tr key={room._id || room.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-hotel-navy">
                    {room.roomNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{room.title}</span>
                    <span className="text-[11px] text-slate-400">{room.type}</span>
                  </td>
                  <td className="py-3 px-4">{room.floor}F</td>
                  <td className="py-3 px-4 font-semibold text-hotel-navy">${room.pricePerNight}</td>
                  <td className="py-3 px-4">{room.capacity?.adults || 2} Adults</td>
                  <td className="py-3 px-4">
                    <select
                      value={room.status}
                      onChange={(e) => handleRoomStatusChange(room._id || room.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                        {
                          available: 'bg-emerald-50 text-emerald-700 border-emerald-300',
                          occupied: 'bg-rose-50 text-rose-700 border-rose-300',
                          cleaning: 'bg-amber-50 text-amber-700 border-amber-300',
                          maintenance: 'bg-slate-100 text-slate-700 border-slate-300',
                        }[room.status]
                      }`}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] text-slate-400">Live Sync</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <h2 className="font-serif text-xl font-bold text-hotel-navy">Recent Guest Reservations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 8).map((b) => (
                <tr key={b._id || b.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{b.bookingCode}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{b.guestDetails?.name}</td>
                  <td className="py-3 px-4">
                    {b.room?.title} (#{b.room?.roomNumber})
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-hotel-navy">${b.totalAmount}</td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold">
                    <span className={b.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-100 text-slate-700">
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-hotel-navy">Add Room to Inventory</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 401"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Category</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                    <option value="Family Villa">Family Villa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Horizon Suite"
                  value={newRoom.title}
                  onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Rate / Night ($)</label>
                  <input
                    type="number"
                    required
                    value={newRoom.pricePerNight}
                    onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Floor</label>
                  <input
                    type="number"
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Size (sq ft)</label>
                  <input
                    type="number"
                    value={newRoom.sizeSqFt}
                    onChange={(e) => setNewRoom({ ...newRoom, sizeSqFt: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Description</label>
                <textarea
                  required
                  rows="2"
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={newRoom.amenities}
                  onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-hotel-navy text-white font-semibold rounded-xl"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
