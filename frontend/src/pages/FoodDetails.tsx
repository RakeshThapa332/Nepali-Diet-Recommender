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

import { useEffect, useState } from "react";

import type {
    FoodCardData
} from "../components/food/FoodCard";
import { getFoodById } from "../services/foodService";

export default function FoodDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [food, setFood] = useState<FoodCardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        getFoodById(Number(id))
            .then((data) => {
                if (isMounted) setFood(data);
            })
            .catch(() => {
                if (isMounted) setFood(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

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

                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {food.mealTypes.map((mealType) => (
                                    <Chip
                                        key={mealType}
                                        label={mealType}
                                        color="primary"
                                    />
                                ))}
                            </Box>
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

