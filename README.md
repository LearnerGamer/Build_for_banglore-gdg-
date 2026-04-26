# Saviour: Disaster Response Platform

**Saviour** is an end-to-end Crisis Management Platform built for the Google Developer Groups Bangalore hackathon. It bridges the communication gap between stranded citizens and emergency responders during large-scale urban crises by providing a real-time, resilient, and secure communication pipeline.

## 🌟 The Six Pillars of Saviour

### 1. Citizen Interface (Mobile App)
A mobile-first application built with React Native (Expo) designed for citizens in distress.
- **One-Tap SOS:** Instantly broadcast GPS coordinates to the central command.
- **Situational Awareness:** View real-time danger zones, nearby relief shelters, and active medical camps on a live map.

### 2. Offline Maps & Resiliency
Built for environments where cellular networks fail.
- **Offline-First:** Utilizes cached maps so citizens can navigate to shelters without internet access.
- **Auto-Sync:** If an SOS is triggered offline, the payload is securely queued locally and auto-syncs to the Command Center the moment a connection is re-established.

### 3. Hardware-Level Data Encryption
Privacy and security for vulnerable citizens and tactical missions.
- **Secure Storage:** Uses `expo-secure-store` to lock anonymous user identities and sensitive tokens directly into the device’s hardware layer (iOS Keychain / Android Keystore), preventing spoofing or interception.

### 4. Admin Command Center (Web Dashboard)
A React (Vite) web application used by emergency authorities.
- **Centroid Clustering:** A custom algorithm groups nearby SOS signals (e.g., in Indiranagar) into unified visual clusters and escalates the threat level based on volume.
- **Live Dispatch:** Admins can select specific tactical units and deploy them to exact coordinates.

### 5. Field Forces Operations
A dedicated interface for responders on the ground (e.g., UNIT-704).
- **Mission Inbox:** Receive dispatched mission details instantly.
- **Actionable Tracking:** Auto-geotag location, upload photo evidence of the rescue, and mark the mission as "Resolved".

### 6. The Sync Bridge (Backend)
A lightweight Node.js/Express server that acts as a central router.
- **High-Frequency Sync:** Synchronizes live data across all mobile and web devices.
- **Automated Archiving:** When a field unit completes a mission, the Bridge automatically moves the incident from the "Active" database into a "Mission History" archive for post-crisis review.

---

## 🛠 Tech Stack

- **Mobile App (Citizen):** React Native, Expo, Expo Secure Store
- **Web Dashboard (Admin/Field):** React 19, Vite, Lucide Icons
- **Mapping:** Leaflet, React-Leaflet
- **Backend Bridge:** Node.js, Express, Local JSON Persistence (Prototype)

---

## 🚀 How to Run Locally

### 1. Start the Sync Bridge (Backend)
The backend routes data between the mobile app and the web dashboards.
```bash
# In the root directory
node bridge.js
```
*(Runs on port 5000)*

### 2. Start the Admin Command Center (Web)
```bash
cd Build_for_banglore-gdg--Admin
npm install
npm run dev
```
*(Runs on port 5173/5174. Open http://localhost:5173 to access the Admin/Field Landing Page)*

### 3. Start the Citizen App (Mobile)
```bash
cd Mobile
npm install
npx expo start
```
*(Use the Expo Go app on your phone to scan the QR code, or press 'a' for Android / 'i' for iOS simulators)*

---

## 🛡️ Built for GDG Bangalore
*Real-time emergency coordination for citizens and first responders.*
