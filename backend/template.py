from pathlib import Path

DIRECTORIES = [
    "src/components", "src/configuration", "src/data_access", "src/entity",
    "src/constants", "src/utils", "src/logger", "src/exception", "src/pipeline",
    "src/ml", "src/ml/models",
    "data/raw", "data/processed",
    "artifacts/models", "artifacts/scalers", "artifacts/reports", "artifacts/logs",
    "config", "notebooks", "frontend", "docs", "tests"
]

FILES = [
    "app.py", "requirements.txt", "README.md", ".gitignore", ".env", "template.py",
    "config/model.yaml", "config/database.yaml", "config/meal_rules.yaml",
    "src/components/__init__.py", "src/components/data_ingestion.py",
    "src/components/data_preprocessing.py", "src/components/clustering.py",
    "src/components/recommendation_engine.py", "src/components/nutrition_calculator.py",
    "src/components/meal_generator.py",
    "src/configuration/__init__.py", "src/configuration/config.py", "src/configuration/database.py",
    "src/data_access/__init__.py", "src/data_access/food_data.py",
    "src/entity/__init__.py", "src/entity/food_entity.py", "src/entity/user_entity.py",
    "src/entity/recommendation_entity.py",
    "src/constants/__init__.py",
    "src/utils/__init__.py", "src/utils/bmi.py", "src/utils/bmr.py", "src/utils/tdee.py", "src/utils/helper.py",
    "src/logger/__init__.py",
    "src/exception/__init__.py",
    "src/pipeline/__init__.py", "src/pipeline/training_pipeline.py", "src/pipeline/recommendation_pipeline.py",
    "src/ml/__init__.py", "src/ml/train.py", "src/ml/predict.py", "src/ml/preprocessing.py",
    "notebooks/EDA.ipynb", "notebooks/KMeans_Training.ipynb",
    "tests/test_pipeline.py"
]

def create_directories():
    for d in DIRECTORIES:
        Path(d).mkdir(parents=True, exist_ok=True)

def create_files():
    for f in FILES:
        p = Path(f)
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists():
            p.touch()

if __name__ == "__main__":
    create_directories()
    create_files()
    print("done")
