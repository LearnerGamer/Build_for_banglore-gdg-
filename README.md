Viewed .env.example:1-6

Here is a comprehensive **README.md** for the updated CODECURE project. This covers both the **Admin Dashboard** and the **Citizen App**, including instructions for the new Firebase and Gemini AI integrations.

```markdown
# CODECURE — Integrated Disaster Response Platform

CODECURE is a next-generation disaster management ecosystem designed for rapid incident reporting, AI-powered analysis, and real-time command-and-control. It consists of two primary applications sharing a unified Firebase backend.

## 📂 Project Structure

- `Build_for_banglore-gdg--Admin/`: Command Center Dashboard for authorized personnel.
- `Build_for_banglore-gdg--app/`: Citizen-facing mobile app for SOS and AI reporting.
- `functions/`: (Located in the Admin repo) Firebase Cloud Functions for Gemini AI and SMS alerts.

## 🚀 Key Features

### 🏢 Admin Command Center
- **Auth Gate**: Secure login for authorized responders.
- **Live SOS Monitor**: Real-time Firestore sync of all incoming distress signals.
- **Gemini AI Analysis**: Automatic incident classification, hazard detection, and unit recommendations.
- **Geo-SMS Broadcast**: Dispatch emergency alerts to all users within a 3km radius of an incident via Twilio.
- **Resource Management**: Live tracking of field forces, shelters, and medical centers.

### 📱 Citizen Application
- **Rescue SOS**: 3-second hold trigger that broadcasts live GPS coordinates to the command center.
- **AI Chat Report**: Describe emergencies or upload photos; our Gemini-powered AI analyzes the scene and provides immediate reassurance while alerting services.
- **Dynamic Map**: Real-time geolocation to find the nearest shelters and hospitals.

## 🛠 Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase Project with **Firestore**, **Authentication (Email/Password)**, and **Functions (Blaze Plan)** enabled.

### 2. Dependency Installation
Run the following in **both** repo directories:
```bash
# In Admin directory
cd Build_for_banglore-gdg--Admin
npm install

# In App directory
cd ../Build_for_banglore-gdg--app
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` in both directories and fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Cloud Functions Setup
Navigate to the `functions` folder (inside the Admin repo) and set your API keys:
```bash
firebase functions:config:set gemini.key="YOUR_GOOGLE_AI_KEY" \
                             twilio.sid="YOUR_TWILIO_SID" \
                             twilio.token="YOUR_TWILIO_TOKEN" \
                             twilio.from="YOUR_TWILIO_NUMBER"

# Deploy functions
firebase deploy --only functions
```

## 🏃 Running Locally

You will need to run both apps in separate terminal windows:

**Start Admin Dashboard:**
```bash
cd Build_for_banglore-gdg--Admin
npm run dev
```

**Start Citizen App:**
```bash
cd Build_for_banglore-gdg--app
npm run dev
```

## 🛡 Security & Design
- **Glassmorphism UI**: High-fidelity, premium dark-mode interface.
- **Auth Gate**: No access to the command center without valid Firebase credentials.
- **Data Privacy**: SOS signals are handled securely via Firestore rules (to be configured in Firebase Console).
```

You can save this as a `README.md` file in your root folder. Let me know if you need any other details added!
