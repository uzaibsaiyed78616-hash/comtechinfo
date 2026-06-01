import { useEffect, useState } from "react";
import axios from "axios";
import { History, Search } from "lucide-react";

export default function TransactionHistory() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState("10"); // String rakha hai dropdown logic ke liye

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  // Filter and Slice logic
  const filteredLogs = logs
    .filter(log => log.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, entries === "all" ? logs.length : parseInt(entries));

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
          <History className="text-emerald-500" size={28} /> Transaction History
        </h2>
        <div className="bg-white border border-gray-100 px-5 py-2 rounded-2xl shadow-sm text-sm font-black text-emerald-600 uppercase tracking-widest">
           Showing: {entries === "all" ? logs.length : filteredLogs.length} of {logs.length}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-sm font-bold text-gray-400">Show</span>
          <select 
            value={entries} 
            onChange={(e) => setEntries(e.target.value)}
            className="bg-transparent border-none outline-none text-emerald-600 font-black cursor-pointer px-1"
          >
            <option value="all">All</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm font-bold text-gray-400">entries</span>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search email..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-100 font-semibold shadow-sm focus:border-emerald-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">Username</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Old Balance</th>
                <th className="p-6">New Balance</th>
                <th className="p-6">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length > 0 ? filteredLogs.map((log) => {
                const amount = Number(log.amount) || 0;
                const oldB = log.oldBalance ?? 0;
                const newB = log.newBalance ?? 0;

                return (
                  <tr key={log._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6 text-sm font-bold text-gray-700">{log.userId?.email || "Unknown"}</td>
                    <td className="p-6 font-black text-sm">
                      <span className={log.type === 'add' ? 'text-emerald-500' : 'text-rose-500'}>
                        {log.type === 'add' ? '+' : '-'}{amount}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-gray-400 font-bold">{oldB}</td>
                    <td className="p-6 text-sm font-black text-gray-900">{newB}</td>
                    <td className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {new Date(log.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400 font-bold italic">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}