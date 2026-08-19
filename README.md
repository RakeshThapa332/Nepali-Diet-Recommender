

# Nepali Diet Recommender

Nepali Diet Recommender is a full-stack web application that creates personalized meal recommendations from a Nepali food dataset. It combines nutritional calculations, user health profiles, meal planning, notifications, and K-Means food clustering.

## Features

- User registration, login, JWT authentication, and silent access-token refresh
- Profile-based BMI, BMR, TDEE, body-type, calorie, and macro calculations
- Personalized breakfast, lunch, and dinner recommendations
- Food explorer with search, meal filters, and numbered server-side pagination
- Meal plan creation and saved recommendation history
- Food intake logging and nutrition progress tracking
- Scheduled meal notifications with unread/read status
- Notification and history pagination with metadata
- Password-confirmed account deletion, including associated profile and nutrition data
- Login and registration rate limiting
- PostgreSQL database with Flask-Migrate migrations

## Technology Stack

- Frontend: React 19, TypeScript, Vite, Material UI, Axios, Recharts
- Backend: Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended
- Security: JWT access and refresh tokens, Flask-Limiter, password hashing
- Database: PostgreSQL
- Machine learning: scikit-learn K-Means clustering and joblib artifacts
- Data processing: pandas and NumPy

## Project Structure

```text
backend/
  app/                 Flask application, routes, services, models, and ML code
  data/                Raw and processed food datasets
  migrations/          Alembic migration files
  models/              Trained K-Means models and scalers
  scripts/             Data import and utility scripts
  tests/               Backend tests
  run.py               Backend entry point
frontend/
  src/                 React pages, components, services, and context
  public/              Static frontend assets
```

## Requirements

- Python 3.11 or newer
- Node.js and npm
- PostgreSQL
- A configured database connection string

## Configuration

### Backend

From the `backend` directory, copy `.env.example` to `.env` and set the database and JWT secret:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/nepali_diet
JWT_SECRET_KEY=replace-with-a-long-random-secret
FLASK_ENV=development
FRONTEND_API_URL=http://127.0.0.1:5000/api
RATELIMIT_STORAGE_URI=memory://
```


### Frontend

From the `frontend` directory, copy `.env.example` to `.env`:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

The frontend uses this value for all API requests. Restart Vite after changing the file.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/RakeshThapa332/Nepali-Diet-Recommender.git
cd Nepali-Diet-Recommender
```

### 2. Set up the backend

Windows PowerShell:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Update `backend/.env` with a valid PostgreSQL connection before running migrations.

### 3. Run database migrations

From the `backend` directory:

```bash
flask --app run.py db upgrade
```

### 4. Import food data

The import script loads `backend/data/processed/nepali_food_clustered.csv` into the database and replaces existing food records:

```bash
python scripts/import_foods.py
```

### 5. Start the backend

From the `backend` directory:

```bash
python run.py
```

The API runs at `http://127.0.0.1:5000` by default.

### 6. Set up and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

For macOS/Linux, use `cp .env.example .env` instead of `copy`. Vite prints the local frontend URL in the terminal, normally `http://localhost:5173`.

## Useful Commands

Backend, from `backend` with the virtual environment active:

```bash
python -m pytest -q
python -m compileall -q app
flask --app run.py db current
flask --app run.py db upgrade
```

Frontend, from `frontend`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## API Notes

Protected endpoints require an access token in the `Authorization` header:

```text
Authorization: Bearer <access-token>
```

Access tokens expire after 30 minutes. The frontend automatically calls `/api/auth/refresh` and retries a failed request using the refresh token. Refresh tokens expire after 30 days.

List endpoints support bounded pagination using `page` and `per_page` query parameters. The response includes the list plus `pagination` metadata:

```text
GET /api/food/?page=2&per_page=24
GET /api/notifications/?page=1&per_page=20
GET /api/history/recommendations?page=1&per_page=20
GET /api/history/intake?page=1&per_page=20
```

Account deletion is available through the authenticated endpoint below and requires the current password in the request body:

```text
DELETE /api/auth/account
```

## License

This project was developed as an academic minor project.
