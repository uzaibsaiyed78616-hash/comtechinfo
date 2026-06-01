import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun, User, Bell, Mail, Phone, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // States
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [showProfile, setShowProfile] = useState(false);

  // Dynamic User Data
  const [user, setUser] = useState({
    name: "Guest User",
    email: "not-logged-in@example.com",
    phone: "N/A"
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Theme Logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Click outside logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white dark:bg-[#0B1120] border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-tight">Overview</h2>

      <div className="flex items-center gap-5">
        
        {/* 1. Notification Bell (Jo wapas aa gayi hai) */}
        <div className="relative group">
          <button 
            onClick={() => alert("There is no new notification right now!")}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all relative"
          >
            <Bell size={22} />
            {/* Red dot for new notification */}
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B1120]"></span>
          </button>
        </div>

        {/* 2. Mode Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200 shadow-sm active:scale-95"
        >
          {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-500" />}
          <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
        </button>

        {/* 3. Profile Dropdown Section */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 focus:outline-none bg-emerald-50/50 dark:bg-emerald-900/10 p-1 pr-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 hover:border-emerald-200 transition-all shadow-sm"
          >
            <div className="h-9 w-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none transition-transform group-active:scale-90">
              <User size={20} />
            </div>
            <div className="hidden lg:block text-left">
               <p className="text-xs font-black text-gray-900 dark:text-white leading-none uppercase">{user.name}</p>
               <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Verified</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showProfile && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-[24px] shadow-2xl py-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-6 pb-4 border-b border-gray-50 dark:border-gray-800">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Details</p>
                <h4 className="text-base font-black text-gray-900 dark:text-white mt-1 uppercase">{user.name}</h4>
              </div>

              <div className="py-3">
                <div className="px-6 py-3 flex items-center gap-4 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-default">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Email</span>
                    <span className="text-sm font-bold truncate">{user.email}</span>
                  </div>
                </div>

              </div>

              <div className="px-5 pt-3 mt-1 border-t border-gray-50 dark:border-gray-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-black text-white bg-red-500 hover:bg-red-600 rounded-xl transition shadow-lg shadow-red-100 dark:shadow-none active:scale-95"
                >
                  <LogOut size={18} />
                  LOGOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}