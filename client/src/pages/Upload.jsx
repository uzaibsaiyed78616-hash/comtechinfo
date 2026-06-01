import { useState, useEffect } from "react";

import axios from "axios";



export default function Upload() {

  const [file, setFile] = useState(null);

  const [number, setNumber] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);



  const handleSend = async () => {

    if (!file || !number) return alert("select the number and the file!");

   

    const token = localStorage.getItem("token");

    if (!token) return alert("Login session expire , please login Again!");



    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    formData.append("number", number);

    formData.append("message", message);

   

    try {

      const res = await axios.post("/api/message/send-media", formData, {

        headers: {

          "Content-Type": "multipart/form-data",

          "Authorization": `Bearer ${token}`

        },

      });

      if (res.data.success) {

        alert("Success! Media sent and record saved.");

        setFile(null); setNumber(""); setMessage("");

      }

    } catch (err) {

      alert("Error: " + (err.response?.data?.message || "Something went wrong!"));

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="p-6">

      <h2 className="text-xl font-bold mb-4 text-blue-700">Send Media </h2>

      <div className="bg-white p-6 shadow-lg rounded-lg border space-y-4">

        <input type="text" placeholder="91XXXXXXXXXX" className="border p-3 w-full rounded" value={number} onChange={(e) => setNumber(e.target.value)} />

        <textarea placeholder="Message..." className="border p-3 w-full rounded" value={message} onChange={(e) => setMessage(e.target.value)} />

        <input type="file" className="border p-2 w-full rounded" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={handleSend} disabled={loading} className={`w-full text-white py-3 rounded ${loading ? "bg-gray-400" : "bg-blue-600"}`}>

          {loading ? "Sending..." : "Send Now"}

        </button>

      </div>

    </div>

  );

}