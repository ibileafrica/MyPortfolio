# Oluwabiyi Ayodele Samson — Creative Director Portfolio

> **High-Converting Video Commercials & Commercial Strategy for Nigeria's Top E-Commerce Brands.**

A full-stack, light-themed, mobile-responsive web portfolio application built with Node.js, Express, and modern web standards.

---

## 🌟 Features

- **Luxury Light Theme**: Clean editorial gallery design, high-contrast typography (`Outfit` and `Plus Jakarta Sans`), and warm sunset rose-coral gradients (`#e11d48` to `#f97316`).
- **Interactive Video Showreel & Lightbox**: Embedded video player modal previewing commercial showreels and campaign videos.
- **E-Commerce Commercial Showcase**: Filterable campaigns categorized into TVCs, DTC Vertical Video Ads (9:16), and Product Launch Films with verified ROAS/GMV metrics.
- **Brand Campaign Booking API**: Interactive AJAX campaign inquiry form connected to an Express backend endpoint (`POST /api/contact`).
- **Mobile-First Responsiveness**: Tailored layout with touch-friendly navigation drawer, fluid typography, and instant WhatsApp consultation link.

---

## 📁 Project Structure

```
├── data/
│   └── projects.json      # Dynamic catalog of commercial campaigns & metrics
├── public/
│   ├── css/
│   │   └── style.css      # Light-theme design system and mobile responsive media queries
│   ├── js/
│   │   └── main.js        # Video modal, typewriter animations, filters, and booking form logic
│   └── index.html         # Semantic HTML5 portfolio webpage
├── .env.example           # Environment variables template
├── .gitignore             # Git ignored paths (node_modules, .env, etc.)
├── package.json           # Node.js dependencies and scripts
└── server.js              # Express HTTP server & REST API
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/ibileafrica/MyPortfolio.git

# Navigate into the project folder
cd MyPortfolio

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the production server
npm start

# Or start in development mode with automatic file watching
npm run dev
```

The application will be accessible at:
👉 `http://localhost:3000`

---

## 📄 License
ISC License © 2026 Oluwabiyi Ayodele Samson. All rights reserved.
