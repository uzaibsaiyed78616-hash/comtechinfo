import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCcw, Loader2, CheckCircle2, MoreHorizontal, Globe, Power, Trash2, Copy, Check } from 'lucide-react';

export default function Devices() {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState("disconnected");
  const [deviceList, setDeviceList] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/device/get-qr", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus(res.data.status);
      setQrCode(res.data.qr);
      if (res.data.device) setDeviceList([res.data.device]);
      else setDeviceList([]);
    } catch (err) { console.error("CheckStatus Error", err); }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAction = async (actionType) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      if (actionType === 'logout') {
        if (!window.confirm("are you ready to delete it?")) {
          setLoading(false);
          return;
        }
        await axios.post("/api/device/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("/api/device/update-status", { status: actionType }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowMenu(null);
      await checkStatus();
      alert(`Success: ${actionType.toUpperCase()} action completed!`);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed! Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black uppercase text-gray-900">Device Linking</h2>
          <p className="text-gray-500 font-medium">Link your WhatsApp to start automation</p>
        </div>
        <button onClick={checkStatus} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">
          <RefreshCcw size={20} /> Refresh Status
        </button>
      </div>

      {/* Main Info Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Section - Bada Size */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[450px]">
          {status === "connected" ? (
            <div className="text-center animate-in zoom-in duration-300">
              <CheckCircle2 size={120} className="text-emerald-500 mx-auto mb-4" />
              <h3 className="text-3xl font-black uppercase text-gray-800 tracking-tight">Linked Successfully</h3>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="w-80 h-80 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shadow-inner relative">
                {qrCode ? (
                  <img src={qrCode} className="w-full h-full p-4 object-contain" alt="QR" />
                ) : (
                  <Loader2 size={60} className="animate-spin text-emerald-500" />
                )}
              </div>
              <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-sm">Scan QR with WhatsApp</p>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <h3 className="text-3xl font-black mb-8 uppercase tracking-widest">Status: <span className={status === "connected" ? "text-emerald-400" : "text-rose-400"}>{status}</span></h3>
          <div className="space-y-4">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
              <p className="text-[12px] text-gray-400 font-bold uppercase mb-2 tracking-widest">Linked Phone Number</p>
              <p className="text-2xl font-black text-emerald-50 tracking-tight">{deviceList[0]?.phoneNumber || "Waiting for connection..."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table -  */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">Channel</th>
                <th className="p-6 w-1/2">Access Token</th>
                <th className="p-6">By System</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deviceList.length > 0 ? deviceList.map((dev, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6 text-base font-black text-gray-700">{dev.phoneNumber}</td>
                  <td className="p-6">
                    <div className="w-full break-all text-[11px] font-mono bg-gray-50 p-4 rounded-xl text-gray-600 border border-gray-100 shadow-sm leading-relaxed relative group">
                      {dev.deviceToken}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase shadow-sm ${dev.status === 'OFFLINE' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {dev.status || "CONNECTED"}
                    </span>
                  </td>
                  <td className="p-6 text-right relative">
                    <button onClick={() => setShowMenu(showMenu === idx ? null : idx)} className="text-gray-300 hover:text-gray-900 p-2 transition-colors">
                      <MoreHorizontal size={24} />
                    </button>
                    {showMenu === idx && (
                      <div className="absolute right-6 top-14 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 py-3 text-left animate-in fade-in zoom-in duration-200">
                        <button onClick={() => handleAction('refresh')} className="w-full px-5 py-3 text-[12px] font-bold text-gray-600 flex items-center gap-3 hover:bg-gray-50">
                          <RefreshCcw size={16} /> Refresh Channel
                        </button>
                        <button onClick={() => handleAction('online')} className="w-full px-5 py-3 text-[12px] font-bold text-emerald-500 flex items-center gap-3 hover:bg-emerald-50">
                          <Globe size={16} /> Put ONLINE
                        </button>
                        <button onClick={() => handleAction('offline')} className="w-full px-5 py-3 text-[12px] font-bold text-amber-500 flex items-center gap-3 hover:bg-amber-50">
                          <Power size={16} /> Put OFFLINE
                        </button>
                        <hr className="my-2 border-gray-50" />
                        <button onClick={() => handleAction('logout')} className="w-full px-5 py-3 text-[12px] font-bold text-rose-500 flex items-center gap-3 hover:bg-rose-50">
                          {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Logout & Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-16 text-center text-gray-400 font-bold italic text-lg">No device linked. Please scan the QR code above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*  API Sample URLs */}
      {deviceList.length > 0 && (
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div>
            <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tight">API Integration Links</h3>
            <p className="text-gray-500 font-medium text-sm">Copy these sample URLs to send messages and files via API.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Message Sample */}
            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100 relative group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-black bg-emerald-600 text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Send Message API</span>
                <button 
                  onClick={() => handleCopy(`/api/send-msg?username=test@gmail.com&number=MOBILE_NUMBER&message=HELLO&token=${deviceList[0]?.deviceToken}`, 'msg')}
                  className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-xl transition-all"
                >
                  {copied === 'msg' ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 font-mono text-[12px] text-gray-700 break-all shadow-inner leading-relaxed">
                /api/send-msg?username=<span className="text-emerald-600 font-bold">test@gmail.com</span>&number=<span className="text-emerald-600 font-bold">MOBILE_NUMBER</span>&message=<span className="text-emerald-600 font-bold">YOUR_MESSAGE</span>&token=<span className="text-emerald-600 font-bold">{deviceList[0]?.deviceToken}</span>
              </div>
            </div>

            {/* File Sample */}
            <div className="bg-blue-50/40 p-8 rounded-3xl border border-blue-100 relative group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-black bg-blue-600 text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Send File API</span>
                <button 
                  onClick={() => handleCopy(`/api/send-msg?username=test@gmail.com&number=MOBILE_NUMBER&message=FILE&token=${deviceList[0]?.deviceToken}&file=URL`, 'file')}
                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-xl transition-all"
                >
                  {copied === 'file' ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-blue-200 font-mono text-[12px] text-gray-700 break-all shadow-inner leading-relaxed">
                /api/send-msg?username=<span className="text-blue-600 font-bold">test@gmail.com</span>&number=<span className="text-blue-600 font-bold">MOBILE_NUMBER</span>&message=<span className="text-blue-600 font-bold">YOUR_MESSAGE</span>&token=<span className="text-blue-600 font-bold">{deviceList[0]?.deviceToken}</span>&file=<span className="text-blue-600 font-bold">D:/file.pdf_OR_URL</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Note: Ensure your device is "ONLINE" in the table above before hitting these endpoints.</p>
          </div>
        </div>
      )}
    </div>
  );
}