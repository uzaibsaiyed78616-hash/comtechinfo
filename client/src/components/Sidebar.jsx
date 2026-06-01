import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Megaphone, FileText, Smartphone, 
  Upload, LogOut, UserPlus, Users, Coins, History 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin"; // Role check

  const menu = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Campaign", path: "/campaign", icon: <Megaphone size={20} /> },
    { name: "Reports", path: "/reports", icon: <FileText size={20} /> },
    { name: "Devices", path: "/devices", icon: <Smartphone size={20} /> },
    { name: "Upload", path: "/upload", icon: <Upload size={20} /> }
  ];

  const adminMenu = [
    { name: "Add User", path: "/admin/add-user", icon: <UserPlus size={20} /> },
    { name: "Manage Users", path: "/admin/manage-users", icon: <Users size={20} /> },
    { name: "User Credits", path: "/admin/credits", icon: <Coins size={20} /> },
    { name: "Transactions", path: "/admin/transactions", icon: <History size={20} /> }
  ];

  const handleLogout = () => {
    if (window.confirm("Do you definitely want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      window.location.reload();
    }
  };

  const renderMenuItem = (item, i) => {
    const isActive = location.pathname === item.path;
    return (
      <Link key={i} to={item.path}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
          isActive 
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}>
          <span className={`${isActive ? "text-emerald-600" : "text-gray-400 group-hover:scale-110"}`}>
            {item.icon}
          </span>
          <span className="font-medium text-[15px]">{item.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full shadow-sm">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Smartphone size={22} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">comtechinfo</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="text-gray-400 text-[11px] uppercase font-bold px-4 mb-2">Main Menu</div>
        {menu.map((item, i) => renderMenuItem(item, i))}

        {isAdmin && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-gray-400 text-[11px] uppercase font-bold px-4 mb-2">Admin Control</div>
            {adminMenu.map((item, i) => renderMenuItem(item, i))}
          </div>
        )}
      </nav>

      <div className="p-6">
         <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
            <LogOut size={20} />
            <span>Logout</span>
         </button>
      </div>
    </div>
  );
}