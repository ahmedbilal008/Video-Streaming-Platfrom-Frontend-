# Video Streaming Application - Frontend

This is the frontend of the **Video Streaming Application**. It interacts with the backend microservices to provide users with the ability to upload, manage, and view short videos. The application is designed using a **Next.js** framework, ensuring fast performance and an intuitive user interface.

## Table of Contents

- [Project Description](#project-description)
- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [Project Constraints](#project-constraints)
- [Testing with Apache JMeter](#testing-with-apache-jmeter)
- [Backend Repository](#backend-repository)
- [Deployment and Running](#deployment-and-running)

## Project Description

The goal of this project is to build a scalable, cloud-based video streaming application that leverages a **microservices architecture**. The backend services are deployed on **Google Cloud Platform (GCP)**, and the frontend is developed using **Next.js**.

The application allows users to upload, manage, and view short videos while ensuring flexibility, scalability, and ease of maintenance. The system is designed to be multi-user, multi-tenant, and role-based, meaning different users can perform different actions based on their roles (e.g., admin, viewer).

## Getting Started

To run the project locally, you can use the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The page auto-updates as you edit `app/page.js`.

## Architecture Overview

The **frontend** is built using **Next.js** and communicates with the backend microservices for video-related operations. Here's an overview of the components:

- **Frontend (Next.js)**: Handles user interaction, video playback, and authentication. It fetches data from backend services via HTTPS APIs.
- **Backend (Microservices)**: Each microservice handles a specific task, such as user authentication, video storage, and video usage monitoring.

The architecture follows a **microservices model**, ensuring flexibility and scalability. All communication between the frontend and backend happens over **secure HTTPs** connections.

### Backend Microservices:

- **Video Service**: Handles video uploads, storage, and retrieval.
- **Logging Service**: Manages logs for system events and user actions.
- **Storage Service**: Manages video file storage and alerts users when they approach storage limits.
- **User Service**: Handles user authentication and JWT token management.
- **Usage Service**: Tracks user video uploads and deletions, with daily bandwidth tracking.

## Project Constraints

1. **User Account Management**:
   - A dedicated `UserAccMgmtServ` microservice handles user authentication and account management. The system uses relational databases (e.g., PostgreSQL) for storing user information and exposes APIs for seamless integration with other microservices.

2. **Storage Management**:
   - The `StorageMgmtServ` microservice allocates **50MB** of cloud storage per user. It implements functionality to alert users when **80% of storage** is consumed and restrict uploads when **100% storage** is reached.

3. **Usage Monitoring**:
   - The `UsageMntrServ` tracks and logs data volume usage. It imposes a daily **100MB bandwidth limit**, with alerts when exceeded.

4. **Video Presentation**:
   - The frontend is built with modern client-side technologies, utilizing **HTML**, **CSS**, and **JavaScript** to display video content. The frontend communicates with the backend services via APIs.

5. **Additional Microservices**:
   - **Controller Service**: Manages interactions and coordination between microservices.
   - **Model Service**: Encapsulates business logic and ensures separation of concerns.

6. **Load Testing**:
   - The application was tested for performance under high concurrency using **Apache JMeter**. Performance graphs and results will be included in the project report.

7. **Logging**:
   - The `LoggingService` is responsible for monitoring user actions, system events, and errors, with logs stored systematically for debugging and analytics.

## Testing with Apache JMeter

Performance testing was conducted using **Apache JMeter** to simulate user activity and evaluate the application’s performance under high concurrency. The tests were designed to assess the scalability and reliability of the backend services.

The testing process involved the following:
1. **Simulating concurrent users** to test the application’s ability to handle traffic.
2. **Generating performance graphs** that show how the application responds under load.
3. **Analyzing results** to identify potential bottlenecks or weaknesses in the system.

**Load testing results** (graphs and analysis) will be included in the project report. Please refer to the images below for performance test results.

> Note: You will paste the **graphs** and **results** here as images.

## Backend Repository

The backend code can be found in the [backend repository](https://github.com/your-repository/backend) (replace this link with your actual backend repository link).

## Deployment and Running

To deploy the backend and frontend, follow these steps:

1. Deploy the backend services to **Google Cloud Run**.
2. Configure the frontend to connect to the deployed backend services using the respective API endpoints.
3. Ensure that the application is accessible via HTTPS and fully functional.

**Link to Running Service:**  
The deployed application can be accessed at [your-deployed-app-url](http://your-deployed-app-url) (replace this with your actual deployed URL).

---

### Adding Images (For Testing Results)

To add images, follow these steps:

1. Place your images (performance graphs) in the `public` folder in the project directory.
2. Use markdown syntax to reference the images like this:

```markdown
![Performance Graph](public/images/jmeter_graph.png)
```

This will display the images directly in the markdown file. Simply replace `public/images/jmeter_graph.png` with the correct path to your image files.

---

This concludes the README for the frontend. If you need any additional information or further assistance, feel free to reach out!
```

### Key Updates:
1. **Project Constraints**: Incorporated a detailed explanation of each project constraint.
2. **Testing Section**: Added a section about load testing using **Apache JMeter**, where you can later include images of the results.
3. **Link to Backend**: Added a placeholder link to the backend repository, which you can update with the actual URL.
4. **Instructions for Adding Images**: Included a brief section explaining how to add images (e.g., JMeter test results) to the markdown. 

Now, you can paste your JMeter test results as images in the appropriate section!
