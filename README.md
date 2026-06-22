💹 FinanceFlow


Smart Personal Finance Dashboard
A full-stack MERN application for tracking expenses, managing budgets, and visualizing financial data through interactive charts.


✨ Features

🔐 Authentication
JWT-based secure login & registration
Password hashing with bcrypt
Token persistence across sessions
Protected routes with auto-redirect

📊 Dashboard
Real-time monthly spending summary
Budget status indicator (On Track / Warning / Over Budget)
Interactive spending breakdown donut chart
6-month spending trend area chart
Animated KPI stat cards with live counters

💳 Transaction Management
Full CRUD — create, view, edit, delete expenses
Filter by category and date range
Pagination for large transaction lists
7 categories: Food, Transport, Entertainment, Utilities, Healthcare, Shopping, Other
Payment method tracking (Cash, Credit Card, Debit Card, etc.)

📈 Analytics
Month-over-month spending comparison
Category breakdown with percentages
Budget vs Actual grouped bar chart
Average transaction value
Top spending category highlight

💰 Budget Tracking
Set spending limits per category per month
Circular progress rings with animated fill
Color-coded alerts (green → amber → red)
Configurable alert threshold (default: 80%)


🛠 Tech Stack
Layer	Technology	Purpose
Frontend	- Next.js 14 (App Router)	React framework, file-based routing
UI Styling	- Tailwind CSS	Utility-first CSS
Animations	-Framer Motion	Page transitions, spring animations
Charts	-Recharts	Pie, area, and bar charts
State-	Zustand	Global auth state management
HTTP Client	- Axios	API calls with JWT interceptor
Backend-	Express.js	REST API server
Database-	MongoDB + Mongoose	Document storage & ODM
Auth-	JWT + bcryptjs	Authentication & password hashing
Validation-	express-validator	Input validation


🚀 Getting Started

Prerequisites
Node.js v18+

1. Clone the repository
bash
git clone https://github.com/yourusername/financial-dashboard.git
cd financial-dashboard

2. Backend Setup
bash
cd backend
npm install
node server.js

4. Frontend Setup
bash

cd frontend
npm install
cp .env.local.example .env.local
npm run dev
