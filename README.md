# 🏗️ BuildTrust — Client

> Immersive 3D construction visualization and blockchain-verified supply chain frontend built with **React 18**, **Three.js**, and **Vite**.

---

## ✨ Features

- **Cinematic 3D Scroll Engine** — A full Three.js scene with procedural building skeletons, animated cranes, blockchain rings, and dust particles. The camera smoothly interpolates through 5 strategic viewpoints as the user scrolls.
- **Multi-Role Dashboards** — Dedicated UI panels for Customers, Owners (Suppliers), and Admins, each with role-specific tools and analytics.
- **Live GPS Order Tracking** — Interactive Leaflet maps with polyline route visualization powered by geocoded coordinates.
- **IPFS Verification UI** — One-click "Verify on IPFS" buttons that query the Pinata gateway, proving supply chain data integrity.
- **Rich Analytics** — Recharts-powered dashboards for quality scores, inventory counts, and order statistics.
- **Micro-Animations** — Framer Motion transitions, hover effects, and tab dynamics throughout the interface.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI rendering |
| **Vite 5** | Lightning-fast HMR dev server & bundler |
| **Three.js / React Three Fiber / Drei** | 3D scene, camera controls, procedural meshes |
| **Framer Motion** | Page transitions & micro-animations |
| **Leaflet / React Leaflet** | Interactive GPS maps for order tracking |
| **Recharts** | Data visualization & analytics charts |
| **Axios** | HTTP client for REST API communication |
| **React Router v7** | Client-side routing & navigation |

---

## 📂 Directory Structure

```
client/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── Scene3D.jsx              # Main 3D canvas with scroll-driven camera
│   │   ├── ApartmentSkeleton.jsx    # Procedural building mesh skeleton
│   │   ├── MaterialShowcase.jsx     # 3D material showroom floor
│   │   ├── BlockchainSection.jsx    # Blockchain info section
│   │   ├── CTASection.jsx           # Call-to-action section
│   │   ├── CustomModel.jsx          # Custom 3D model loader
│   │   ├── DashboardSection.jsx     # Dashboard preview section
│   │   ├── HeroSection.jsx          # Landing hero section
│   │   ├── MaterialsPage.jsx        # Materials catalog page
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── ProtectedRoute.jsx       # Auth-guarded route wrapper
│   │   └── ServicesSection.jsx      # Services overview section
│   ├── pages/
│   │   ├── LoginPage.jsx            # Multi-role sign-in panel
│   │   ├── RegisterPage.jsx         # Sign-up with role selection
│   │   ├── AdminDashboard.jsx       # Admin analytics & system stats
│   │   ├── OwnerDashboard.jsx       # Supplier material & order tools
│   │   ├── CustomerDashboard.jsx    # Catalog shopping & order status
│   │   ├── OrderTracking.jsx        # GPS map tracking view
│   │   └── VerifyChain.jsx          # IPFS verification page
│   ├── context/
│   │   └── AuthContext.jsx          # JWT session state provider
│   ├── hooks/                       # Custom React hooks
│   ├── App.jsx                      # Root router & scroll HUD listener
│   ├── main.jsx                     # React DOM entry point
│   └── index.css                    # Global styles & design tokens
├── index.html                       # HTML shell
├── vite.config.js                   # Vite config with API proxy
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- The **server** must be running on `http://localhost:5000` (API requests are proxied via Vite)

### Installation

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install
```

### Development

```bash
# Start the Vite dev server (opens http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Build optimized static bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🔗 API Proxy

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000`:

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

> Make sure the backend server is running before starting the client.

---

## 🎬 Scroll Camera Stops

The 3D camera navigates through these cinematic viewpoints as the user scrolls:

| # | Stop Name | Description |
|---|---|---|
| 1 | **Hero** | Wide atmospheric overview of the construction site |
| 2 | **Materials** | Concentrated orbit view of the material showroom |
| 3 | **Blockchain** | Low-angle zoom on structural beams |
| 4 | **Dashboard** | Elevated overview looking down at the complex |
| 5 | **CTA** | Close-up cinematic detail shot |

---

## 👥 User Roles

| Role | Dashboard | Capabilities |
|---|---|---|
| **Customer** | `CustomerDashboard` | Browse materials, place orders, track shipments, verify IPFS certificates |
| **Owner** | `OwnerDashboard` | Manage inventory, process orders, update transit routes, pin to IPFS |
| **Admin** | `AdminDashboard` | Platform analytics, system health, network configuration |

---

## 📄 License

This project is private and proprietary.
