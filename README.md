# 💎 Digital Expense Tracker (Full-Stack)

A premium, secure, and modern fintech dashboard for tracking personal and organizational expenses. Built with a high-end **Glassmorphism** design and a robust Spring Boot + React architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Spring Boot](https://img.shields.io/badge/backend-Spring_Boot_3.4-brightgreen.svg)
![React](https://img.shields.io/badge/frontend-React_19-blue.svg)

---

## ✨ Key Features

- 🔐 **Secure Authentication**: Stateless JWT-based login and registration system.
- 📊 **Dynamic Data Visualization**: Beautiful, interactive charts powered by Recharts (Spending by Category, Monthly Trends).
- 💰 **Transaction Management**: Record and categorize income/expenses with instant UI updates.
- 🤖 **AI Spending Insights**: Intelligent feedback on your spending habits to help you save more.
- 🎯 **Budget Alerts**: Real-time monthly budget tracking with visual warnings when nearing limits.
- 📱 **Premium UI/UX**: Fully responsive design with Dark/Light mode support and sleek micro-animations.

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- Redux Toolkit (State Management)
- Recharts (Data Visualization)
- Lucide-React (Modern Icons)
- Vanilla CSS (Glassmorphism System)

**Backend:**
- Spring Boot 3.4
- Spring Security (JWT Protection)
- Spring Data JPA (Hibernate)
- H2 In-Memory Database (No setup required!)

---

## 🚀 Getting Started

### Local Development

1. **Clone the repo:**
   ```bash
   git clone https://github.com/lakshaysanwal/expensetracker.git
   ```

2. **Run the Backend:**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

3. **Run the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Production Build
To create a single executable JAR that runs both frontend and backend:
```powershell
./deploy.ps1
```

---

## ☁️ Deployment

This project is optimized for deployment on **Render**, **Railway**, or **Docker** using the provided `Dockerfile`.

**Steps for Render:**
1. Connect your GitHub repository.
2. Set Environment to **Docker**.
3. Render will use the multi-stage build to serve the app on Port 8080.

---

## 📝 Author
Created by **[lakshaysanwal](https://github.com/lakshaysanwal)**. Feel free to contribute or reach out for collaborations!
