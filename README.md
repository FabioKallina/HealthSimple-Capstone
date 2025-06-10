# 💪 HealthSync

**HealthSync** is a full-stack wellness application designed to empower users to take control of their health by tracking workouts, nutrition, habits, water intake, weight, and more. It also enables users to connect with a community, participate in challenges, and monitor holistic progress over time.

---

## 🧠 Project Overview

HealthSync was built to help users manage and improve their physical and mental well-being through a unified platform. It integrates multiple health-tracking features in one place, supporting daily habit tracking, fitness planning, nutritional monitoring, and social motivation via challenges and friendships.

Whether you're just starting your fitness journey or looking for a comprehensive wellness tracker, HealthSync offers a streamlined, intuitive experience.

---

## ✨ Features

### 🔐 Authentication & Security
- User registration, login, and JWT-based session handling
- Forgot/reset password functionality
- Protected routes for logged-in users only

### 🏋️ Workout Tracking
- Start a workout session
- Search and add exercises
- Log sets, reps, and weights
- Save completed workouts and view summaries

### 🍎 Nutrition Logging
- Log daily food intake
- Search foods using an external API
- View macronutrient breakdown

### 💧 Water & Weight Tracking
- Input daily water intake
- Log and visualize weight over time

### 🔁 Habit Tracking
- Track daily habits (e.g., sleep, meditation, journaling)
- Custom and predefined habit support
- View streaks and progress

### 👥 Community & Challenges
- Follow friends and view their profiles
- Join and complete challenges
- Earn badges for consistency and milestones

### 📊 Dashboard & Visualization
- Personalized home dashboard
- Charts for steps, water, weight, habits, and more
- Streak counters and weekly summaries

---

## 🛠 Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/healthsync.git
cd healthsync
```

### 2. **Backend Set Up**
```bash
cd backend
npm install
```

### Create .env in /backend
```bash
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_front_end_url
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass_key
```

### Start the Backend Server
```bash
npm run dev
```

### 3. **Front End Set Up**
```bash
cd frontend
npm install
```

### Create .env in /frontend
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ID=your_api_id
VITE_APP_KEY=you_api_key
```

### Start the Frontend Development Server
```bash
npm run dev
```

### 3. Set up Environment Variables
This app uses the **OpenWeatherMap API**.. To run it locally, you need to set up your own OpenWeather APIKey.
1. Go to https://openweathermap.org/ and **sign up** (or log in if you already have an account).
2. In your **Profile**, go to **My API Keys** and copy your API Key.
3. Create a `.env` file in the root directory and add the following line: 
    ```ini
   VITE_WEATHER_API_KEY=your-api-key
   ```

### 4. **Run the App**
```bash
npm run dev
```

---

## ▶️ Usage

1. **Register** or **log in** to your account.
2. Access your **personalized dashboard** to view key health metrics.
3. Navigate through the main sections:
   - 🏋️ **Workout**: Start a session, add exercises, log sets/reps/weights.
   - 🍽️ **Nutrition**: Search and log meals, view macros.
   - 🔁 **Habits**: Track and visualize habit streaks.
   - 💧 **Check-In**: Log water and weight daily.
   - 👥 **Community**: Follow friends, complete challenges.
4. View progress summaries and personalized insights over time.

---

## 🧰 Technologies Used

### 🖥 Frontend

- **React** (via Vite)
- **React Router DOM**
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Recharts** for data visualization
- **JWT Decode**
- **CSS Modules**

### 🌐 Backend

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **dotenv** for environment variables
- **jsonwebtoken** for auth
- **bcryptjs** for password hashing
- **cors** for cross-origin access

### 🔗 APIs & Services

- **OpenWeatherMap API** (optional, for weather data)
- **External Nutrition/Food API**
- **EmailJS or similar service** for email support (optional)

---

## 🚀 Deployment

### Hosted On

- **Frontend**: [Render / Netlify / Vercel] (choose one or all)
- **Backend**: [Render](https://render.com)

## 📈 Future Improvements
-📱 Fully responsive mobile support / PWA version
-📅 Calendar-based activity view with drag/drop
-🔔 Daily email/push notifications for goals
-📤 Export data as CSV or PDF
-🧠 AI-driven personalized recommendations
-🔗 Google Fit / Apple Health / Fitbit integration
-💬 Real-time group chat or coaching features
-📊 Advanced data analytics & habit predictions
-📷 Upload progress photos
-🎯 Gamification with levels, points, and leaderboards

## 👤 Author

**Fabio Kallina de Paula**

- 🔗 [LinkedIn](https://www.linkedin.com/in/fabiokallinadepaula)
- 🌐 [Portfolio](https://your-portfolio-link.com)
- 📧 fabio.your-email@example.com

Feel free to connect or reach out if you're interested in collaborating, have feedback, or want to learn more about this project!

---

## 🏁 Quick Start Summary

```bash
# 1. Clone the repository
git clone https://github.com/your-username/healthsync.git
cd healthsync

# 2. Backend setup
cd backend
npm install
# Create a .env file with required variables
npm run dev

# 3. Frontend setup
cd ../frontend
npm install
# Create a .env file with your API keys and backend URL
npm run dev
```

## 🛠 Built With

### 🖥️ Frontend

- **React + Vite** – Fast, modern frontend tooling
- **React Router DOM** – Client-side routing
- **Tailwind CSS** – Utility-first CSS framework for styling
- **Recharts** – Data visualization (charts for weight, steps, water, etc.)
- **Axios** – For making HTTP requests
- **JWT Decode** – Decode and handle JSON Web Tokens
- **CSS Modules** – Modular and scoped CSS styling
- **Responsive Design** – Mobile-friendly UI and components

### 🌐 Backend

- **Node.js + Express.js** – Backend server and routing
- **MongoDB + Mongoose** – NoSQL database with object modeling
- **dotenv** – Environment variable management
- **jsonwebtoken** – Secure authentication via JWT
- **bcryptjs** – Password hashing for secure user data
- **cors** – Handle cross-origin requests
- **nodemailer** – (Optional) Email handling for forgot password/reset

### 🔗 APIs & External Services

- **Edamam API** – Food and nutrition data
- **OpenWeatherMap API** – Weather data for user dashboards (optional)
- **Render** – Hosting for backend and/or frontend
- **EmailJS / Nodemailer** – Email integration for notifications

---


