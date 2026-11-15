# HealthPredict AI

**An AI-powered Patient Health Prediction and Management System**

HealthPredict AI is a web application that helps manage patient information, store blood test results, and generate AI-assisted health observations using Google's Gemini API.

## Features

- **Patient Management:** Create, view, update, and delete patient records.
- **Input Validation:** Validates email addresses, dates of birth, and numerical blood test values.
- **Persistent Storage:** Stores patient information using SQLite.
- **AI Health Assessment:** Integrates Google's Gemini API to generate observations based on submitted blood test values.
- **User-Friendly Dashboard:** React-based interface for managing patient records and viewing AI-generated remarks.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Python, FastAPI |
| Database | SQLite |
| AI Integration | Google Gemini API |
| Validation | Pydantic |
| HTTP Client | Axios, HTTPX |

## Patient Information

The application manages the following information:

- Full Name
- Date of Birth
- Email Address
- Glucose
- Haemoglobin
- Cholesterol
- AI-Generated Remarks

## Project Structure

```text
HealthPredict-AI/
├── backend/
│   └── app/
│       ├── routers/
│       ├── services/
│       ├── config.py
│       ├── database.py
│       ├── main.py
│       ├── models.py
│       └── schemas.py
├── frontend/
│   └── src/
├── .gitignore
├── requirements.txt
└── README.md
```

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/suha0/HealthPredict-AI.git
cd HealthPredict-AI
```

### 2. Set up the Python backend

```bash
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the Gemini API key

Create a `.env` file inside the `backend` folder:

```text
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your own API key. Never commit this file to GitHub.

### 4. Start the backend

```powershell
cd backend
..\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Backend: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 5. Set up the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## AI Integration

The application uses Google's Gemini API to generate brief observations from patient blood test values.

The generated remarks are informational only and are not a confirmed medical diagnosis. Patients should consult qualified healthcare professionals for medical interpretation.

## Important

- Keep API keys and other secrets private.
- Do not upload `.env` files or database files containing patient information.
- Use appropriate safeguards before deploying with real patient data.

## Repository

[HealthPredict AI – GitHub](https://github.com/suha0/HealthPredict-AI)
