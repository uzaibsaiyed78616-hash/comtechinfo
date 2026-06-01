import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // API Call logic
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const res = await axios.get("/api/report/all-reports", {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          search: search, 
          status: statusFilter === "All Status" ? "" : statusFilter 
        }
      });

      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchReports]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Search & Filter Header */}
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800">Delivery Reports</h3>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-600"
          >
            <option>All Status</option>
            <option>Sent</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Job ID</th>
              <th className="px-6 py-4">Number</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>
            ) : reports.length > 0 ? (
              reports.map((r, i) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  {/* SERIES WISE JOB ID: Ab ye 1, 2, 3 dikhayega */}
                  <td className="px-6 py-4 text-emerald-600 font-medium">{i + 1}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{r.number}</td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-[300px]">{r.message}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      r.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400 font-medium">Records not found!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}