import { useState } from "react";
import axios from "axios";
import { UserPlus, Mail, Lock, Coins, ShieldCheck } from "lucide-react";

export default function AddUser() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "user", credits: 100 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/admin/add-user", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      setFormData({ email: "", password: "", role: "user", credits: 100 });
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to create user"));
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <UserPlus className="text-emerald-500" /> Add New User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 tracking-tight">Email Address</label>
            <input type="email" placeholder="user@gmail.com" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 tracking-tight">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} value={formData.password} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 tracking-tight">Credits</label>
              <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500" 
              onChange={(e) => setFormData({...formData, credits: e.target.value})} value={formData.credits} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 tracking-tight">Role</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500" 
              onChange={(e) => setFormData({...formData, role: e.target.value})} value={formData.role}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-gray-200 mt-4">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}