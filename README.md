Perfect 👍 this is very important.


# 📘 CampusSync – Setup Guide

Campus Event & Sponsorship Management Platform

---

# 1️⃣ Project Overview

CampusSync is a full-stack web application built using:

Frontend: React (Vite)
Backend: Node.js + Express
Database: MongoDB Atlas

This guide explains how to set up the project from scratch.

---

# 2️⃣ Required Software

Each team member must install:

✔ Node.js (v18 or higher)
✔ npm (comes with Node)
✔ MongoDB Atlas account
✔ Git
✔ Postman (optional, for API testing)

Check installation:

```
node -v
npm -v
```

---

# 3️⃣ Clone the Project

```
git clone <repository-url>
cd campus-event-platform
```

You should see:

```
client/
server/
```

---

# 4️⃣ Backend Setup (Server)

Navigate to server folder:

```
cd server
```

Install dependencies:

```
npm install
```

---

## 🔐 Create Environment File

Inside `server/` create:

```
.env
```

Add:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campus_event_db?retryWrites=true&w=majority
PORT=5000
```

⚠ Do NOT push .env to GitHub.

---

## ▶ Start Backend Server

```
npm run dev
```

You should see:

```
MongoDB Connected
Server running on port 5000
```

Backend runs at:

```
http://localhost:5000
```

---

# 5️⃣ Frontend Setup (Client)

Open new terminal.

Navigate to client:

```
cd client
```

Install dependencies:

```
npm install
```

Start frontend:

```
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 6️⃣ MongoDB Atlas Setup

1. Go to MongoDB Atlas
2. Create new project
3. Create free cluster
4. Create database user
5. Allow network access (0.0.0.0/0 for development)
6. Copy connection string
7. Paste inside `.env`

Database name used:

```
campus_event_db
```

Collections will be created automatically:

* venues
* resources
* sponsors

---

# 7️⃣ Testing Backend (Optional)

Using Postman:

Create Venue:

POST

```
http://localhost:5000/api/venues
```

Create Resource:

POST

```
http://localhost:5000/api/resources
```

Get Sponsors:

GET

```
http://localhost:5000/api/sponsors
```

---

# 8️⃣ Project Structure

```
client/
 ├── pages/
 ├── components/
 ├── services/

server/
 ├── src/
 │   ├── models/
 │   ├── controllers/
 │   ├── routes/
 │   ├── config/
```

---

