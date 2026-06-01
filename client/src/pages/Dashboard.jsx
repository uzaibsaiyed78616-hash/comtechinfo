import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Send, AlertCircle, Activity, CheckCircle2, Clock, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ credits: 0, sent: 0, failed: 0, history: [] });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/message/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setStats(res.data.stats);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const chartData = [
    { name: 'Mon', sent: Math.floor(stats.sent * 0.2) },
    { name: 'Tue', sent: Math.floor(stats.sent * 0.5) },
    { name: 'Wed', sent: Math.floor(stats.sent * 0.8) },
    { name: 'Today', sent: stats.sent },
  ];

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <RefreshCw className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-10 space-y-8 bg-[#fcfcfc] min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">comtechinfo <span className="text-emerald-500">Analytics</span></h1>
          <p className="text-slate-500 font-medium">Monitoring your message efficiency.</p>
        </div>
        <button onClick={() => window.location.reload()} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:rotate-180 transition-all duration-500">
          <RefreshCw size={20} className="text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Credits', val: stats.credits, icon: <Wallet />, color: 'blue' },
          { label: 'Sent', val: stats.sent, icon: <Send />, color: 'emerald' },
          { label: 'Failed', val: stats.failed, icon: <AlertCircle />, color: 'red' },
        ].map((card, i) => (
          <motion.div whileHover={{ y: -5 }} key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 flex items-center justify-center bg-${card.color}-50 text-${card.color}-600 rounded-2xl mb-4`}>{card.icon}</div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{card.label}</p>
            <h2 className="text-4xl font-black text-slate-900 mt-1">{card.val}</h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2 italic"><Activity size={20}/> Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="sent" stroke="#10b981" strokeWidth={4} fill="url(#colorSent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2"><Clock size={18}/> Recent</h3>
            <Link to="/reports" className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400">VIEW ALL</Link>
          </div>
          <div className="space-y-4">
            {stats.history.slice(0, 5).map((msg, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={msg.status === 'sent' ? 'text-emerald-400' : 'text-red-400'}>{msg.status === 'sent' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}</div>
                  <span className="text-sm font-bold">+{msg.number}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}