import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        
        const userData = {
          id: res.data.user.id,
          name: email.split('@')[0],
          email: res.data.user.email,
          role: res.data.user.role, // Role save ho raha hai
          credits: res.data.user.credits
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        
        alert("Login Success! Welcome " + userData.name);
        navigate("/");
        window.location.reload(); 
      }
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || "Invalid Credentials"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if(!email || !password) return alert("Filling in the details is mandatory!");
    setLoading(true);
    try {
      await axios.post("/api/auth/register", { email, password });
      alert("Account Created! Now Sign In.");
    } catch (err) {
      alert("Registration Failed: " + (err.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-lg shadow-emerald-200">
            <LogIn size={30} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">comtechinfo Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="email" placeholder="Email Address" onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            {loading ? "PROCESSING..." : "SIGN IN"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-100">
          <button type="button" onClick={handleRegister} className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
            <div className="flex items-center gap-3">
              <UserPlus size={20} className="text-emerald-400" />
              <span>Register Me First</span>
            </div>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}