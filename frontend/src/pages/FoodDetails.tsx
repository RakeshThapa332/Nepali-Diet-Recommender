import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import type {
    FoodCardData
} from "../components/food/FoodCard";

const foods: FoodCardData[] = [
    {
        id: 1,
        name: "Dal Bhat",
        category: "Main Course",
        calories: 520,
        protein: 18,
        carbs: 82,
        fat: 12,
    },
    {
        id: 2,
        name: "Momo",
        category: "Snack",
        calories: 280,
        protein: 14,
        carbs: 30,
        fat: 11,
    },
    {
        id: 3,
        name: "Thukpa",
        category: "Main Course",
        calories: 350,
        protein: 16,
        carbs: 48,
        fat: 10,
    },
    {
        id: 4,
        name: "Sel Roti",
        category: "Snack",
        calories: 190,
        protein: 3,
        carbs: 28,
        fat: 8,
    },
    {
        id: 5,
        name: "Aloo Tama",
        category: "Curry",
        calories: 210,
        protein: 6,
        carbs: 30,
        fat: 7,
    },
    {
        id: 6,
        name: "Gundruk",
        category: "Vegetable",
        calories: 80,
        protein: 4,
        carbs: 12,
        fat: 2,
    },
    {
        id: 7,
        name: "Chicken Curry",
        category: "Curry",
        calories: 320,
        protein: 28,
        carbs: 10,
        fat: 18,
    },
    {
        id: 8,
        name: "Dahi",
        category: "Dairy",
        calories: 100,
        protein: 5,
        carbs: 7,
        fat: 5,
    },
];

export default function FoodDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const food = foods.find(
        (item) => item.id === Number(id)
    );

    if (!food) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/foods")
                    }
                >
                    Back to Food Explorer
                </Button>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mt: 4 }}
                >
                    Food not found
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/foods")}
                sx={{ mb: 3 }}
            >
                Back to Food Explorer
            </Button>

            <Card
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        height: {
                            xs: 220,
                            md: 320,
                        },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                    }}
                >
                    <Typography variant="h1">
                        🍛
                    </Typography>
                </Box>

                <CardContent
                    sx={{
                        p: {
                            xs: 3,
                            md: 4,
                        },
                    }}
                    >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "flex-start",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                gutterBottom
                            >
                                {food.name}
                            </Typography>

                            <Chip
                                label={food.category}
                                color="primary"
                                />
                        </Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                            color="primary"
                        >
                            {food.calories} kcal
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Nutritional Information
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr 1fr",
                                sm: "repeat(3, 1fr)",
                            },
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <NutritionItem
                            label="Calories"
                            value={`${food.calories} kcal`}
                        />

                        <NutritionItem
                            label="Protein"
                            value={`${food.protein} g`}
                        />
                        <NutritionItem
                            label="Carbohydrates"
                            value={`${food.carbs} g`}
                        />

                        <NutritionItem
                            label="Fat"
                            value={`${food.fat} g`}
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

interface NutritionItemProps {
    label: string;
    value: string;
}

function NutritionItem({
    label,
    value,
}: NutritionItemProps) {
    return(
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mt: 0.5 }}
            >
                {value}
            </Typography>
        </Box>
    );
}

