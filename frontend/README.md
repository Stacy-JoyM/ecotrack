# 🌿 EcoTrack: Carbon Footprint Tracking and AI Guidance

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Project Status](https://img.shields.io/badge/Status-Development-orange.svg)]()
[![Code Style: Black (Backend)](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

**EcoTrack** is a full-stack application designed to help users monitor, calculate, and ultimately **reduce their personal carbon footprint**. It provides intelligent tracking, detailed visualization, AI-powered recommendations, and discovery of local sustainable alternatives.

---

## ✨ Key Features

| Component | Feature | Task Codes |
| :--- | :--- | :--- |
| **Backend** | **Carbon Calculation Engine** | 
| **Backend** | **AI Chatbot API** | 
| **Frontend** | **Interactive Dashboard** | 
| **Frontend** | **Local Alternatives Map** | 
| **Both** | **Secure Authentication** | 

---

## 🚀 Getting Started

This project is composed of two primary repositories/directories: `ecotrack-ai-backend` (Python API) and `ecotrack-ai-frontend` (Client Application). Both must be configured and running.

### Prerequisites

* **Python** (3.8+)
* **[Your Database Type]** (e.g., PostgreSQL)
* **Git**

### 1. Backend Setup

The backend handles all data processing, authentication, and core business logic.

1.  **Navigate to the backend directory:**
    ```bash
    cd ecotrack-ai-backend
    ```
2.  **Set up the environment:**
    ```bash
    # Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate
    
    # Install dependencies
    pip install -r requirements.txt
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the backend root. You must define your database connection and necessary API keys (e.g., LLM key, geocoding service key).
   
4.  **Run Database Migrations:**
    ```bash
    # Command specific to your ORM/migration tool (e.g., Alembic, Flask-Migrate)
    python manage.py db upgrade
    ```
5.  **Start the Server:**
    ```bash
    flask run
    ```
    The API should be running on `http://localhost:8000`.

### 2. Frontend Setup

The frontend provides the user interface for tracking and visualizing data.

1.  **Navigate to the frontend directory:**
    ```bash
    cd ecotrack-ai-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```
3.  **Configure API Base URL:**
    Create a `.env` file in the frontend root, pointing to your running backend.
    
    ```env
    REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
    ```
4.  **Start the Client:**
    ```bash
    npm start
    # OR
    yarn start
    ```
    The application will open in your browser, usually at `http://localhost:3000`.

---

## 🗺️ Project Structure

The project maintains a clear separation of concerns between the API and the client.