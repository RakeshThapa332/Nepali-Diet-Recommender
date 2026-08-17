from app.services.macros import calculate_macro_targets


def test_endomorph_macros():

    result = calculate_macro_targets(
        target_calories=2617.56,
        body_type="endomorphic",
    )

    assert result["protein"] > 0
    assert result["fat"] > 0
    assert result["carbs"] > 0


def test_mesomorph_macros():

    result = calculate_macro_targets(
        target_calories=2500,
        body_type="mesomorph",
    )

    assert result["protein"] == 187.5
    assert result["fat"] == round(2500 * 0.25 / 9, 2)
    assert result["carbs"] == 281.25