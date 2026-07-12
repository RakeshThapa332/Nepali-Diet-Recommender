# Nepali Diet Recommender

## Project Description

**Nepali Diet Recommender** is a web-based diet recommendation system that generates personalized meal recommendations using a Nepali food dataset. The system applies unsupervised machine learning (K-Means clustering) along with nutritional calculations such as BMI, BMR, and TDEE to recommend suitable meals based on a user's profile and health goals.

## Tech Stack

* **Frontend:** React + TypeScript (Vite)
* **Backend:** Flask (Python)
* **Machine Learning:** Scikit-learn
* **Database:** PostgreSQL
* **Data Processing:** Pandas, NumPy



## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RakeshThapa332/Nepali-Diet-Recommender.git
```

### 2. Move into the project

```bash
cd Nepali-Diet-Recommender
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

### 5. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 6. Install frontend dependencies

```bash
cd frontend
npm install
```

### 7. Run the frontend

```bash
npm run dev
```

### 8. Run the backend

Open another terminal from the project root:

```bash
python app.py
```



## License

This project is developed as a minor project for academic purposes.
