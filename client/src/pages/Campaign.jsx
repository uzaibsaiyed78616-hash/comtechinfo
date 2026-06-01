import { useState } from "react";

import axios from "axios";

import { Send, Smartphone } from "lucide-react";



export default function Campaign() {

  const [number, setNumber] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);



  const handleSend = async () => {

    if(!number || !message) return alert("Enter the number and message!");

   

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

     

      const res = await axios.post(

        "/api/message/send-msg",

        { number, message },

        { headers: { Authorization: `Bearer ${token}` } }

      );



      console.log(res.data);

      alert("Message Sent Successfully!");

      setNumber(""); setMessage("");

    } catch (err) {

      alert("Error: " + (err.response?.data?.error || "Something is wrong."));

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="max-w-2xl mx-auto bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">

        <Send className="text-emerald-500" /> Campaign

      </h2>



      <div className="space-y-6">

        <div>

          <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number (Without 91)</label>

          <input

            placeholder="9997778881"

            value={number}

            onChange={(e) => setNumber(e.target.value)}

            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"

          />

        </div>



        <div>

          <label className="block text-sm font-bold text-gray-700 mb-2">Message Content</label>

          <textarea

            rows="5"

            placeholder="Type your WhatsApp message here..."

            value={message}

            onChange={(e) => setMessage(e.target.value)}

            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"

          />

        </div>



        <button

          onClick={handleSend}

          disabled={loading}

          className={`w-full py-4 rounded-2xl text-white font-bold transition-all ${

            loading ? "bg-gray-400" : "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-100"

          }`}

        >

          {loading ? "Sending..." : "Send WhatsApp"}

        </button>

      </div>

    </div>

  );

}