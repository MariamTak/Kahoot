# 🎮 Kahoot Clone

A real-time multiplayer quiz game built with **Ionic**, **Angular**, and **Firebase** — inspired by Kahoot. Players can create quizzes, host live games, and compete in real time using a 4-character entry code.

---

## Features

-  **Authentication** — Register, login, and password recovery via Firebase Auth
-  **Quiz Builder** — Create and manage quizzes with multiple-choice questions and optional image uploads
-  **Live Games** — Host a game session and share an entry code for players to join
-  **Real-time Gameplay** — Questions are pushed live to all players simultaneously
-  **Leaderboard** — Score tracking with time-based bonuses
-  **Mobile-ready** — Built with Ionic + Capacitor for iOS and Android support
-  **QR Code & Barcode Scanner** — Scan to join a game session

---

## Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Framework    | Angular 21 + Ionic 8                |
| Mobile       | Capacitor 8 (iOS & Android)         |
| Backend      | Firebase (Firestore, Auth, Storage) |
| State        | RxJS + Angular Signals              |
| Styling      | SCSS                                |
| Testing      | Cypress            |
| Linting      | ESLint + TypeScript ESLint          |

---

## Prerequisites

- Node.js `>= 18`
- npm `>= 9`
- Angular CLI: `npm install -g @angular/cli`
- Ionic CLI: `npm install -g @ionic/cli`

---

## Installation

```bash
# Clone the repository
git clone https://github.com/MariamTak/Kahoot.git
cd kahoot

# Install dependencies
npm install
```

---

## 🔧 Firebase Setup

1. Create a project on [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Enable **Storage**
5. Copy your Firebase config into:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

---

## ▶️ Running the App

```bash
ionic build
ionic start
```

---

## Mobile (Capacitor)

```bash
# Add platforms
npx cap add ios
npx cap add android

# Sync and open
npx cap sync
npx cap open android 
```

---

##  Testing

```bash
# Unit tests
npm test

# E2E tests (Cypress)
npx cypress open
```

