SUPPORTED_BODY_TYPES = {
    "ectomorph",
    "mesomorph",
    "endomorph",
}


BODY_TYPE_MACROS = {
    "ectomorph": {
        "protein": 0.25,
        "fat": 0.25,
        "carbs": 0.50,
    },
    "mesomorph": {
        "protein": 0.30,
        "fat": 0.25,
        "carbs": 0.45,
    },
    "endomorph": {
        "protein": 0.35,
        "fat": 0.30,
        "carbs": 0.35,
    },
}


def calculate_macro_targets(
    target_calories: float,
    body_type: str,
) -> dict:
    """
    Calculate daily protein, fat, and carbohydrate targets
    from the user's calorie target and body type.

    Macro percentages are converted to grams using:
        Protein       = 4 kcal/g
        Carbohydrate  = 4 kcal/g
        Fat           = 9 kcal/g
    """

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    body_type = body_type.strip().lower()

    # Accept both adjective and noun forms.
    body_type_mapping = {
        "ectomorphic": "ectomorph",
        "mesomorphic": "mesomorph",
        "endomorphic": "endomorph",
    }

    body_type = body_type_mapping.get(
        body_type,
        body_type
    )

    if body_type not in SUPPORTED_BODY_TYPES:
        raise ValueError(
            f"Unsupported body type: {body_type}"
        )

    percentages = BODY_TYPE_MACROS[body_type]

    protein_calories = (
        target_calories
        * percentages["protein"]
    )

    fat_calories = (
        target_calories
        * percentages["fat"]
    )

    carb_calories = (
        target_calories
        * percentages["carbs"]
    )

    protein_grams = protein_calories / 4
    fat_grams = fat_calories / 9
    carb_grams = carb_calories / 4

    return {
        "protein": round(protein_grams, 2),
        "fat": round(fat_grams, 2),
        "carbs": round(carb_grams, 2),
        "protein_percentage": (
            percentages["protein"] * 100
        ),
        "fat_percentage": (
            percentages["fat"] * 100
        ),
        "carbs_percentage": (
            percentages["carbs"] * 100
        ),
    }