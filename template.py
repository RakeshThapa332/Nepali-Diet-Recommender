from pathlib import Path

# ============================
# Directories
# ============================

DIRECTORIES = [
    # Source Code
    "src/components",
    "src/configuration",
    "src/data_access",
    "src/entity",
    "src/constants",
    "src/utils",
    "src/logger",
    "src/exception",
    "src/pipeline",

    # ML
    "src/ml",
    "src/ml/models",

    # Dataset
    "data/raw",
    "data/processed",

    # Artifacts
    "artifacts/models",
    "artifacts/scalers",
    "artifacts/reports",
    "artifacts/logs",

    # Configuration
    "config",

    # Research
    "notebooks",

    # Frontend
    "frontend",

    # Documentation
    "docs",

    # Tests
    "tests"
]

# ============================
# Files
# ============================

FILES = [

    # Root
    "app.py",
    "requirements.txt",
    "README.md",
    ".gitignore",
    ".env",
    "template.py",

    # Configuration
    "config/model.yaml",
    "config/database.yaml",
    "config/meal_rules.yaml",

    # Components
    "src/components/__init__.py",
    "src/components/data_ingestion.py",
    "src/components/data_preprocessing.py",
    "src/components/clustering.py",
    "src/components/recommendation_engine.py",
    "src/components/nutrition_calculator.py",
    "src/components/meal_generator.py",

    # Configuration
    "src/configuration/__init__.py",
    "src/configuration/config.py",
    "src/configuration/database.py",

    # Data Access
    "src/data_access/__init__.py",
    "src/data_access/food_data.py",

    # Entity
    "src/entity/__init__.py",
    "src/entity/food_entity.py",
    "src/entity/user_entity.py",
    "src/entity/recommendation_entity.py",

    # Constants
    "src/constants/__init__.py",

    # Utilities
    "src/utils/__init__.py",
    "src/utils/bmi.py",
    "src/utils/bmr.py",
    "src/utils/tdee.py",
    "src/utils/helper.py",

    # Logger
    "src/logger/__init__.py",

    # Exception
    "src/exception/__init__.py",

    # Pipeline
    "src/pipeline/__init__.py",
    "src/pipeline/training_pipeline.py",
    "src/pipeline/recommendation_pipeline.py",

    # ML
    "src/ml/__init__.py",
    "src/ml/train.py",
    "src/ml/predict.py",
    "src/ml/preprocessing.py",

    # Notebooks
    "notebooks/EDA.ipynb",
    "notebooks/KMeans_Training.ipynb",

    # Tests
    "tests/test_pipeline.py"
]

# ============================
# Create Directories
# ============================

def create_directories():
    print("\nCreating directories...\n")

    for directory in DIRECTORIES:
        try:
            Path(directory).mkdir(parents=True, exist_ok=True)
            print(f"✓ {directory}")
        except Exception as e:
            print(f"✗ {directory} -> {e}")

# ============================
# Create Files
# ============================

def create_files():
    print("\nCreating files...\n")

    for file in FILES:
        try:
            path = Path(file)
            path.parent.mkdir(parents=True, exist_ok=True)

            if not path.exists():
                path.touch()
                print(f"✓ {file}")
            else:
                print(f"Already exists: {file}")

        except Exception as e:
            print(f"✗ {file} -> {e}")

# ============================
# Main
# ============================

def main():
    print("=" * 50)
    print(" Nepali Diet Recommendation Project Setup")
    print("=" * 50)

    create_directories()
    create_files()

    print("\nProject structure created successfully!")

if __name__ == "__main__":
    main()