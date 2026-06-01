import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Trash2, Edit, X, Save } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Modal toggle
  const [editData, setEditData] = useState({ role: "", credits: 0 });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, email) => {
    if (window.confirm(`Do you really ${email} want to delete?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/delete-user/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("User Deleted!");
        fetchUsers();
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.message || "Error"));
      }
    }
  };

  // Modal kholne ke liye function
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditData({ role: user.role, credits: user.credits });
  };

  // Changes save karne ke liye function
  const handleUpdateSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/admin/update-user/${editingUser._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("User Updated!");
        setEditingUser(null); // Modal close 
        fetchUsers(); // List refresh
      }
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || "Error"));
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Users className="text-emerald-500" size={28} /> Manage Users
        </h2>
        <span className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-2xl text-sm font-black border border-emerald-100">
          Total: {users.length}
        </span>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Email</th>
              <th className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Role</th>
              <th className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Credits</th>
              <th className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-5 text-gray-700 font-semibold">{user.email}</td>
                <td className="p-5">
                  <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-5 font-black text-gray-900">{user.credits}</td>
                <td className="p-5 flex gap-3 text-gray-400">
                  <button onClick={() => handleEditClick(user)} className="hover:text-emerald-500 transition-all p-1">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(user._id, user.email)} className="hover:text-red-500 transition-all p-1">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL POPUP */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit className="text-emerald-500" size={20} /> Edit User
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">User Email</label>
                <div className="p-4 bg-gray-50 rounded-2xl text-gray-500 font-medium border border-gray-100">
                  {editingUser.email}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assign Role</label>
                <select 
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Credits</label>
                <input 
                  type="number"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                  value={editData.credits}
                  onChange={(e) => setEditData({...editData, credits: e.target.value})}
                />
              </div>

              <button 
                onClick={handleUpdateSave}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
              >
                <Save size={18} /> SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}