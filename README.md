# AI Career Advisor — Prototype (ai-career-advisor)

A personalized and dynamic AI-powered career advisor designed specifically for Indian students. This platform goes beyond generic advice by providing a "Career Digital Twin," AI-generated roadmaps, and discovering hidden job opportunities in the rapidly evolving job market.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quickstart (Local Development)](#quickstart-local-development)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Deployment](#deployment)
- [Project Architecture](#project-architecture)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features

* **Career Digital Twin**: A living, AI-powered profile that tracks your skills, projects, and certifications. It provides a real-time **Job Readiness Index** and identifies your **next best skill** to learn.
* **Localized + Personalized Career Paths**: Recommendations tailored to your unique profile and the Indian job market, complete with salary insights (LPA), demand levels, and automation risk scores.
* **AI-Generated Roadmaps**: Step-by-step learning plans for any career path, visualized as a skill tree or career ladder.
* **Interview Prep**: An AI mentor that asks tailored questions and provides instant feedback on your answers.
* **Hidden Opportunities Explorer**: Discover niche, high-paying, future-proof jobs that most students don't know about.
* **Mentor Matching**: Connect with real-world professionals and alumni.
* **Project Ideas**: Get a list of project ideas for beginners, intermediate, and advanced levels to build a strong portfolio.

## Prerequisites

To run this project, you need to have the following installed on your machine:
* Python 3.8+
* Node.js v18+ and npm
* (Optional) A Google Cloud project with Vertex AI access and the Gemini API enabled. You will need to set up a service account and authenticate your local environment to use real AI responses.

## Quickstart (Local Development)

The project is a full-stack application with a separate backend and frontend. You will need to run both simultaneously in two different terminal windows.

### 1. Backend Setup

Open your first terminal and follow these steps to start the FastAPI server.

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment**:
    ```bash
    python -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    .\venv\Scripts\activate.ps1
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up Google Cloud credentials**: Place your service account JSON file (e.g., `credentials.json`) in the `backend` folder and set the environment variable. **Note**: This is for local development. For production, you would use a more secure method.
    ```bash
    # On macOS/Linux:
    export GOOGLE_APPLICATION_CREDENTIALS="./credentials.json"
    # On Windows:
    set GOOGLE_APPLICATION_CREDENTIALS=.\credentials.json
    ```

5.  **Run the FastAPI server**:
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will now be running, typically at `http://127.0.0.1:8000`.

### 2. Frontend Setup

Open your second terminal and follow these steps to start the Vue.js development server.

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install npm packages**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The frontend will be running, typically at `http://localhost:5173`. Open this URL in your browser to view the application.

## Deployment

The live version of the project is deployed at the following URL:
[https://ai-career-advisor-9.onrender.com](https://ai-career-advisor-9.onrender.com)

## Project Architecture

The project is built on a modular, client-server architecture:
* **Frontend**: A single-page application (SPA) built with Vue.js that handles all user interaction and makes API calls to the backend.
* **Backend**: A Python-based API built with FastAPI that processes all requests, contains the core business logic, and orchestrates calls to the generative AI models.
* **AI/ML Layer**: The Google Cloud Vertex AI platform, which powers the Gemini API for all generative features (content creation, analysis, etc.).
* **Database**: (If implemented) A PostgreSQL database to store persistent user data, such as profiles, past recommendations, and progress.

## Technologies Used

* **Frontend**: Vue.js, Vue Router, Tailwind CSS, Axios
* **Backend**: Python, FastAPI, Uvicorn, Python-Dotenv
* **AI/ML**: Google Cloud Vertex AI, Gemini API
* **Containerization**: Docker (for deployment)

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, please contact [VARSHINI M].