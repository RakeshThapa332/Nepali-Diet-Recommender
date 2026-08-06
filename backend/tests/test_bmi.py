from app.services.bmi import calculate_bmi

bmi, category = calculate_bmi(70, 175)
bmi, category = calculate_bmi(50, 170)

print(f"BMI: {bmi}")
print(f"Category: {category}")