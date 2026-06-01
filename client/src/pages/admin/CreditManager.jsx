import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Minus, CreditCard, RefreshCcw } from "lucide-react";

export default function UserCredits() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("add"); // 'add' or 'remove'
  const [loading, setLoading] = useState(false);

  // 1. Fetch Users for Search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  // 2. Filter Users based on Search
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handle Update Function
  const handleUpdate = async () => {
    if (!selectedUser || amount <= 0) {
      alert("select a user and enter the amount!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/admin/update-credits", {
        userId: selectedUser._id,
        amount: amount,
        type: type,
        remark: `Admin ${type === 'add' ? 'added' : 'removed'} credits manually`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert(`Credits Updated! New Balance: ${res.data.newBalance}`);
        // Reset fields
        setAmount(0);
        setSelectedUser({ ...selectedUser, credits: res.data.newBalance });
      }
    } catch (err) {
      alert("Failed to update credits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-100">
          <CreditCard className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">Credit Manager</h2>
          <p className="text-gray-400 text-sm font-medium">Update user balance instantly</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-8">
        
        {/* 1. Search Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Search & Select User</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Enter email address..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Search Dropdown Results */}
          {searchTerm && !selectedUser && (
            <div className="mt-2 max-h-40 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl">
              {filteredUsers.map(user => (
                <div 
                  key={user._id}
                  onClick={() => { setSelectedUser(user); setSearchTerm(user.email); }}
                  className="p-4 hover:bg-emerald-50 cursor-pointer font-bold text-gray-600 transition-colors"
                >
                  {user.email} <span className="text-gray-300 text-xs ml-2">(Bal: {user.credits})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Action Selector (Add/Remove) */}
        <div className="flex gap-4">
          <button 
            onClick={() => setType("add")}
            className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${type === 'add' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Plus size={20} /> ADD
          </button>
          <button 
            onClick={() => setType("remove")}
            className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${type === 'remove' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Minus size={20} /> REMOVE
          </button>
        </div>

        {/* 3. Amount Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount to {type}</label>
          <input 
            type="number"
            placeholder="0"
            className="w-full p-6 bg-gray-50 rounded-3xl border-none text-center text-4xl font-black text-gray-800 focus:ring-2 focus:ring-emerald-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* 4. Display Selected User Info */}
        {selectedUser && (
          <div className="bg-gray-50 p-5 rounded-3xl border border-dashed border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Selected User</p>
              <p className="font-bold text-gray-700">{selectedUser.email}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase">Current Balance</p>
              <p className="font-black text-2xl text-emerald-600">{selectedUser.credits}</p>
            </div>
          </div>
        )}

        {/* 5. Submit Button */}
        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="animate-spin" /> : <RefreshCcw size={20} />}
          UPDATE CREDITS NOW
        </button>

      </div>
    </div>
  );
}