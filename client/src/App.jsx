import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Pages
import Dashboard from "./pages/Dashboard";
import Campaign from "./pages/Campaign";
import Reports from "./pages/Reports";
import Devices from "./pages/Devices";
import Upload from "./pages/Upload";
import Login from "./pages/Login";

// Admin Pages 
import AddUser from "./pages/admin/AddUser";
import ManageUsers from "./pages/admin/ManageUsers";
import CreditManager from "./pages/admin/CreditManager";
import TransactionHistory from "./pages/admin/TransactionHistory";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAuthenticated = !!localStorage.getItem("token");
  
  // Admin Check: 
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] dark:bg-[#0B1120] overflow-hidden font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaign" element={<Campaign />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/upload" element={<Upload />} />

              {/*  Admin Routes (Sirf Admin ko access milega) */}
              {isAdmin && (
                <>
                  <Route path="/admin/add-user" element={<AddUser />} />
                  <Route path="/admin/manage-users" element={<ManageUsers />} />
                  <Route path="/admin/credits" element={<CreditManager />} />
                  <Route path="/admin/transactions" element={<TransactionHistory />} />
                </>
              )}

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}