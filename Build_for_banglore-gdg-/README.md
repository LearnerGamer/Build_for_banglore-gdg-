# SAVIOUR: Disaster Response Platform

SAVIOUR is a unified disaster response and emergency management platform built for Google Developer Groups Bangalore. It integrates two distinct experiences into a single application:

1. **Citizen Mode**: A mobile-optimized interface for civilians to trigger SOS alerts, view nearby shelters/hospitals on a map, and read safety guidelines.
2. **Admin Dashboard**: A desktop command-center for first responders to monitor a live feed of SOS signals, manage field forces, track shelters, and coordinate emergency responses.

## Tech Stack
- **Frontend**: React 19, Vite
- **Mapping**: Leaflet, React-Leaflet
- **Styling**: Vanilla CSS, Glassmorphism design system
- **Icons**: Lucide React

## How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Navigate to the project directory
The unified application is located in the `Build_for_banglore-gdg--Admin` folder.
```bash
cd Build_for_banglore-gdg--Admin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open the App
Once the server starts, open your browser and navigate to:
```
http://localhost:5173
```
You will be greeted by the Role-Select Landing Page where you can choose to enter the **Citizen Mode** or the **Admin Dashboard**.
``
## Features
- **Role-Based Routing**: Seamlessly switch between the Citizen App and the Admin Command Center.
- **Shared Data Bridge**: SOS alerts triggered in the Citizen app are instantly picked up by the Admin Dashboard's live feed using localized storage.
- **Interactive Maps**: Real-time visualization of SOS signals, shelters, hospitals, and danger zones.
