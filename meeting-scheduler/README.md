# MeetSpace – Functional Meeting Scheduler

A full-stack meeting scheduler built with **React + Framer Motion** (frontend) and **Node.js + Express + MongoDB** (backend).
---

## ✨ Features

1. **Login by name** — no password, just type your name to identify yourself
2. **Create a Meeting Space** — generates a unique join code automatically
3. **Join a Meeting Space** — using the code shared by a teammate
4. **Schedule meetings** inside a space — visible to every member of that space
5. **Personal Calendar** — shows every meeting across every space you're part of
6. **5-minute alert notification** — a banner pops up when a meeting is about to start
7. **Animated 404 page**, page transitions, modals — all using Framer Motion

---

## 🗂 Project Structure

```
meeting-scheduler/
├── server/              # Node.js + Express + MongoDB backend
│   ├── models/           # Mongoose schemas (User, MeetingSpace, Meeting)
│   ├── routes/           # API routes (auth, spaces, meetings)
│   ├── server.js         # Entry point
│   ├── .env              # insert the mongoDB URI
│   └── package.json
│
└── client/               # React frontend
    ├── src/
    │   ├── pages/         # Login, Spaces, SpaceDetail, Calendar, 404
    │   ├── components/    # Sidebar, PageWrapper, MeetingAlertBanner
    │   ├── hooks/          # useMeetingNotifications (5-min alert logic)
    │   ├── AuthContext.js  # Shares logged-in user across the app
    │   └── api.js          # Axios instance pointing to backend
    └── package.json
```

---
## To start
**installing the node modules in client and server folders**
- create the .env file write PORT=5000 and MONGO_URI=mongodb+srv://<db.username>:<db.password>@cluster0.1uzzwm2.mongodb.net/meetspace?appName=Cluster0
- write **npm i** in both the server and client terminal.
- then write **npm start** in both terminals.
---
