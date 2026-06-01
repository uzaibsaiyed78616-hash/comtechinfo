# ⚡ ChatWay - Full-Stack AI-Powered WhatsApp Marketing & API Gateway Platform

ChatWay is a highly scalable, production-ready SaaS platform that provides users with automated WhatsApp marketing workflows via a modern frontend dashboard, secure multi-user session management architectures, and custom HTTP API trigger endpoints.

🌐 **Live System URL:** [https://comtechinfo.com](https://comtechinfo.com)

---

## 🏗️ System Architecture & Workflow

The ChatWay infrastructure is cleanly divided into two main operational segments that run independently on a cloud server to maximize scaling thresholds and resource performance:

1. **Frontend Core:** Client-side React.js dashboard handling browser states, local secure token bindings, and instantaneous QR websocket feeds rendered into an intuitive user interface.
2. **Backend Engine:** Dynamic Node.js & Express server regulating volatile memory matrix sessions (`whatsapp-web.js` running over a headless Puppeteer automation layer) while synchronizing background transactional logs with native database metrics in real-time.

---

## 🎨 Frontend Technical Blueprint

The frontend dashboard interface is engineered using an optimized responsive grid layout to maintain a lightweight rendering pipeline across diverse client devices.

### 🚀 Tech Stack Used
* **Framework Engine:** React.js (Vite workflow environment)
* **Design Typography:** Tailwind CSS (Modern utility-first layout framework)
* **Iconographic Tokens:** Lucide React / React Icons
* **Routing Layer:** React Router DOM (Single Page Application architecture mapping)
* **Network Client:** Axios (Custom interceptors configured for automated Bearer Token request injection)

### ✨ Core Modules Deployed
* 📊 **Smart Metrics Analytics:** Live asynchronous counters tracking successfully sent logs, delivery dropouts, and remaining active wallet credits.
* 📱 **Session Orchestration Hub:** QR code handshake matrix displaying live interactive terminal feeds directly through reactive WebSocket connection frameworks.
* 🧾 **Audit Logs Datatable:** High-performance history matrix ledger equipped with structural data formatting for delivery status auditing.

---

## ⚙️ Backend Core & Architecture Ledger

The backend architecture enforces strict system boundaries, structuring hardware resource distribution and asynchronous data pipelines.

### 🚀 Tech Stack Used
* **Runtime Environment:** Node.js (Asynchronous Event-Driven Architecture with ES6 Modules)
* **Application Framework:** Express.js 
* **Database Management:** MongoDB Cluster (Distributed Document Storage mapped via Mongoose ORM data models)
* **Session Automation:** `whatsapp-web.js` (State management engine backed by a headless Chromium/Puppeteer browser wrapper)
* **Process Monitor:** PM2 (Production Process Manager with Keep-Alive auto-restart hooks)
* **Reverse Proxy Architecture:** Nginx configuration optimized with Let's Encrypt (Certbot SSL auto-renewal pipelines)

### 🔥 Advanced Logic Configurations Deployed
* 🪙 **Dynamic Credit Wallet System:** Implements automated atomic decrement operations (`credits -= 1`) over secure database transactional boundaries strictly upon message delivery acknowledgement.
* 📂 **Universal Media Routing Engine:** A versatile runtime file engine that dynamically differentiates between local physical string paths and public web endpoints (`http://` / `https://`), downloading remote assets securely into memory objects using `MessageMedia.fromUrl` runtime queries.
* 🛡️ **Session Crash Resilience Framework:** Fault-tolerant exception listeners designed to capture complex Puppeteer lifecycle edge cases (such as a `detached Frame` error), automatically clearing broken memory blocks and shifting database user states to `OFFLINE` seamlessly.

---

## 🛠️ Monolithic Directory Map

```text
/
├── chatway-frontend/          # React.js Vite Client Application Workspace
│   ├── src/
│   │   ├── components/        # Reusable global layout modules (Cards, Navbar, Sidebar)
│   │   ├── pages/             # Stateful operational views (Devices, Dashboard, History)
│   │   └── context/           # Authorization state structures & dynamic route locks
│   └── .env                   # Operational production endpoint parameters
│
└── chatway-backend/           # Express Server Workspace (Deployed directly at /var/www/)
    ├── config/                # Database connectivity & process parameter initializers
    ├── controllers/           # Core business logic processing incoming requests
    ├── models/                # Rigid Mongoose schemas (User.js, Message.js)
    ├── routes/                # Endpoint binders mapping network flows to controllers
    └── server.js              # Monolithic service root bootstrapping application modules

## System Engineering Profile
  "Project": "ChatWay Automation Ecosystem",
  "Status": "Production-Ready / Deployed",
  "Developed By": "Uzaib Saiyad",
  "Contact Email": "uzaibsaiyed78616@gmail.com"
