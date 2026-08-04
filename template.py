from pathlib import Path

# ===========================
# Directories
# ===========================

DIRECTORIES = [
    # Backend
    "backend/app",
    "backend/app/models",
    "backend/app/routes",
    "backend/app/services",
    "backend/app/ml",
    "backend/app/utils",
    "backend/app/config",
    "backend/migrations",

    # Data
    "backend/data/raw",
    "backend/data/processed",

    # ML Artifacts
    "backend/artifacts/models",
    "backend/artifacts/scalers",
    "backend/artifacts/reports",

    # Documentation
    "docs",

    # Jupyter Notebooks
    "notebooks",

    # Testing
    "tests",

    # Frontend (React)
    "frontend"
]

# ===========================
# Files
# ===========================

FILES = [

    # Root
    "README.md",
    ".gitignore",

    # Backend
    "backend/.env",
    "backend/requirements.txt",
    "backend/run.py",

    # Flask App
    "backend/app/__init__.py",
    "backend/app/extensions.py",

    # Config
    "backend/app/config/__init__.py",
    "backend/app/config/config.py",

    # Models
    "backend/app/models/__init__.py",
    "backend/app/models/user.py",
    "backend/app/models/food.py",
    "backend/app/models/recommendation.py",

    # Routes
    "backend/app/routes/__init__.py",
    "backend/app/routes/auth.py",
    "backend/app/routes/user.py",
    "backend/app/routes/food.py",
    "backend/app/routes/recommendation.py",

    # Services
    "backend/app/services/__init__.py",
    "backend/app/services/bmi.py",
    "backend/app/services/bmr.py",
    "backend/app/services/tdee.py",
    "backend/app/services/nutrition.py",
    "backend/app/services/recommendation_engine.py",

    # ML
    "backend/app/ml/__init__.py",
    "backend/app/ml/preprocessing.py",
    "backend/app/ml/train.py",
    "backend/app/ml/predict.py",

    # Utils
    "backend/app/utils/__init__.py",
    "backend/app/utils/helper.py",
    "backend/app/utils/validators.py",

    # Data
    "backend/data/raw/.gitkeep",
    "backend/data/processed/.gitkeep",

    # Artifacts
    "backend/artifacts/models/.gitkeep",
    "backend/artifacts/scalers/.gitkeep",
    "backend/artifacts/reports/.gitkeep",

    # Notebooks
    "notebooks/EDA.ipynb",
    "notebooks/KMeans_Training.ipynb",

    # Tests
    "tests/test_api.py",
    "tests/test_ml.py"
]


# ===========================
# Create Directories
# ===========================

def create_directories():
    for directory in DIRECTORIES:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"Created Directory : {directory}")


# ===========================
# Create Files
# ===========================

def create_files():
    for file in FILES:
        path = Path(file)

        path.parent.mkdir(parents=True, exist_ok=True)

        if not path.exists():
            path.write_text("", encoding="utf-8")
            print(f"Created File      : {file}")
        else:
            print(f"Already Exists    : {file}")


# ===========================
# Main
# ===========================

if __name__ == "__main__":
    create_directories()
    create_files()
    print("\nProject structure created successfully!")