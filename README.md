# Video Streaming Application - Frontend

This is the frontend of the **Video Streaming Application**, a cloud-based short video streaming platform. The application is designed using **Next.js** and interacts with backend microservices to allow users to upload, manage, and view videos seamlessly.

## 🚀 Project Links

- **Frontend Repository**: [GitHub - Frontend](https://github.com/ahmedbilal008/Video-Streaming-Platfrom-Frontend-)
- **Backend Repository**: [GitHub - Backend](https://github.com/ahmedbilal008/Video-Streaming-Platform-backend-)
- **Live Application**: [Cloud Project on Vercel](https://cloud-project-snowy.vercel.app/)
- **Test Credentials**: 
  - Email: `example1@gmail.com`  
  - Password: `123456`  
  *(This account has admin access to view logs)*

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [Performance Testing](#performance-testing)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## 📌 Project Overview

This project is a **microservices-based cloud application** designed for **scalable and efficient video streaming**. Built using **Next.js** for the frontend and **Google Cloud Platform (GCP)** for backend deployment, the system follows a **multi-user, multi-tenant** model, ensuring role-based access control.

---

## 🎯 Features

✅ **User Authentication**: Secure login and registration using JWT tokens.  
✅ **Video Upload & Management**: Upload videos, delete, and monitor storage limits.  
✅ **Streaming**: Efficient video playback with optimized streaming.  
✅ **Usage Monitoring**: Tracks bandwidth usage and storage limits.  
✅ **Admin Logs**: View user actions and system logs (Admin access only).  
✅ **Scalable Microservices**: Backend is fully microservices-based, deployed on **GCP Cloud Run**.

---

## 🛠 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js (Microservices)
- **Database**: PostgreSQL (Supabase)
- **Storage**: Cloudinary (for video storage)
- **Hosting**: Vercel (Frontend), Google Cloud Run (Backend)

---

## 💻 Getting Started

### Clone the Repository
```bash
$ git clone https://github.com/ahmedbilal008/Video-Streaming-Platfrom-Frontend-.git
$ cd Video-Streaming-Platfrom-Frontend-
```

### Install Dependencies
```bash
$ npm install  # or yarn install
```

### Run the Development Server
```bash
$ npm run dev  # or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🏗 Architecture Overview

This project follows a **microservices architecture** with **Next.js** handling the frontend and backend microservices handling different functionalities.

### **Backend Microservices**
- **User Service**: Manages user authentication and account handling.
- **Video Service**: Handles video uploads, retrieval, and deletion.
- **Logging Service**: Records user actions and system events.
- **Storage Service**: Manages user video storage and limits.
- **Usage Service**: Monitors daily bandwidth and video consumption.

### **Microservice Communication Flow**
1. The **frontend** interacts with the **backend services** through secure API calls.
2. The **User Service** authenticates users and issues JWT tokens.
3. The **Video Service** manages uploads, retrievals, and storage.
4. The **Logging Service** records all actions asynchronously.
5. The **Usage Service** monitors daily bandwidth and storage consumption.

---

## 📊 Performance Testing

The application was stress-tested using **Apache JMeter**. Below are key results from our performance tests:

- **Simulated concurrent users:** 1000
- **Metrics Evaluated:**
  - Response time under load
  - API throughput
  - Error rates
  - System stability

### 📉 Performance Graphs
*(Attach Apache JMeter test result images here for better insights)*

---

## 🚀 Deployment

### **Frontend Deployment on Vercel**
1. **Push code to GitHub**: Ensure your frontend code is committed and pushed to GitHub.
2. **Deploy on Vercel**: Connect GitHub repo to [Vercel](https://vercel.com/) and deploy.
3. **Configure Environment Variables**: Add necessary `.env` variables in Vercel settings.
4. **Run Build & Deploy**: Vercel will automatically build and deploy the application.

### **Backend Deployment on Google Cloud Run**
The backend microservices are containerized using **Docker** and deployed to **Google Cloud Run** for auto-scaling and efficient resource management.

---

## 🖼 Screenshots

| **Home Page** | **Dashboard** |
|--------------|--------------|
| *(Insert Home Page Screenshot)* | *(Insert Dashboard Screenshot)* |

| **Logs Page (Admin Only)** | **Profile Page** |
|------------------|------------------|
| *(Insert Logs Screenshot)* | *(Insert Profile Screenshot)* |

---

## 📜 Conclusion

This **Video Streaming Platform** is a robust and scalable cloud-based solution, built using modern technologies and deployed on **GCP & Vercel**. With **JWT-based authentication**, **microservices architecture**, and **optimized cloud storage**, this project serves as a **real-world example** of how cloud computing can be effectively leveraged.

🔹 **Frontend Repo**: [GitHub - Frontend](https://github.com/ahmedbilal008/Video-Streaming-Platfrom-Frontend-)  
🔹 **Backend Repo**: [GitHub - Backend](https://github.com/ahmedbilal008/Video-Streaming-Platform-backend-)  
🔹 **Live Project**: [Cloud Project on Vercel](https://cloud-project-snowy.vercel.app/)

🚀 Happy coding!
