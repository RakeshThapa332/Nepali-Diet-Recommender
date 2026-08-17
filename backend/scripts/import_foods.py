import os
import sys

import pandas as pd

# Allow importing app from backend directory
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from app import create_app
from app.extensions import db
from app.models.food import Food



#configuration
CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "processed",
    "nepali_food_clustered.csv"
)

app = create_app()

with app.app_context():

    print("=" * 60)
    print("IMPORTING FOOD DATA")
    print("=" * 60)


    df = pd.read_csv(CSV_PATH)

    print("CSV loaded successfully.")
    print("Rows:", len(df))

    required_columns = [
        "sn",
        "food_name",
        "protein",
        "fat",
        "carbs",
        "fiber",
        "calories",
        "calcium",
        "iron",
        "vitamin_c",
        "breakfast",
        "lunch",
        "dinner",
        "food_name_clean",
        "breakfast_cluster",
        "lunch_cluster",
        "dinner_cluster"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:

        print("\nERROR: Missing columns:")
        print(missing_columns)

        raise ValueError(
            "CSV does not contain all required columns."
        )

    print("All required columns found.")


    df = df.replace(
        {
            pd.NA: None,
            "": None
        }
    )

    # Convert meal columns to boolean
    for column in [
        "breakfast",
        "lunch",
        "dinner"
    ]:
        df[column] = (
            df[column]
            .fillna(0)
            .astype(bool)
        )

    # Convert cluster columns
    for column in [
        "breakfast_cluster",
        "lunch_cluster",
        "dinner_cluster"
    ]:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )


    print("\nRemoving existing food records...")

    db.session.query(Food).delete()

    db.session.commit()

    print("Existing food records removed.")

    foods = []

    for _, row in df.iterrows():

        food = Food(
            sn=int(row["sn"]),

            food_name=str(
                row["food_name"]
            ),

            food_name_clean=(
                str(row["food_name_clean"])
                if pd.notna(row["food_name_clean"])
                else None
            ),

            protein=(
                float(row["protein"])
                if pd.notna(row["protein"])
                else None
            ),

            fat=(
                float(row["fat"])
                if pd.notna(row["fat"])
                else None
            ),

            carbs=(
                float(row["carbs"])
                if pd.notna(row["carbs"])
                else None
            ),

            fiber=(
                float(row["fiber"])
                if pd.notna(row["fiber"])
                else None
            ),

            calories=(
                float(row["calories"])
                if pd.notna(row["calories"])
                else None
            ),

            calcium=(
                float(row["calcium"])
                if pd.notna(row["calcium"])
                else None
            ),

            iron=(
                float(row["iron"])
                if pd.notna(row["iron"])
                else None
            ),

            vitamin_c=(
                float(row["vitamin_c"])
                if pd.notna(row["vitamin_c"])
                else None
            ),

            breakfast=bool(
                row["breakfast"]
            ),

            lunch=bool(
                row["lunch"]
            ),

            dinner=bool(
                row["dinner"]
            ),

            breakfast_cluster=(
                int(row["breakfast_cluster"])
                if pd.notna(row["breakfast_cluster"])
                else None
            ),

            lunch_cluster=(
                int(row["lunch_cluster"])
                if pd.notna(row["lunch_cluster"])
                else None
            ),

            dinner_cluster=(
                int(row["dinner_cluster"])
                if pd.notna(row["dinner_cluster"])
                else None
            )
        )

        foods.append(food)


    db.session.add_all(foods)

    db.session.commit()

    print("\nFood data inserted successfully.")

    total_foods = db.session.query(Food).count()

    breakfast_count = (
        db.session
        .query(Food)
        .filter(Food.breakfast == True)
        .count()
    )

    lunch_count = (
        db.session
        .query(Food)
        .filter(Food.lunch == True)
        .count()
    )

    dinner_count = (
        db.session
        .query(Food)
        .filter(Food.dinner == True)
        .count()
    )

    print("\n" + "=" * 60)
    print("DATABASE VERIFICATION")
    print("=" * 60)

    print("Total foods:", total_foods)
    print("Breakfast foods:", breakfast_count)
    print("Lunch foods:", lunch_count)
    print("Dinner foods:", dinner_count)

    print("=" * 60)
    print("IMPORT COMPLETED")
    print("=" * 60)