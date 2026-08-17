import {
    Card,
    CardContent,
    CardMedia,
    Box,
    Typography,
    Chip,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

export interface FoodCardData {
    id: number;
    name: string;
    category: string;
    mealTypes: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    image?: string;
}

interface FoodCardProps {
    food: FoodCardData;
}

export default function FoodCard({ food, }: FoodCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/foods/${food.id}`);
    };

    return (
        <Card 
        onClick = {handleClick}
        sx={{
            height: "100%",
            cursor: "pointer",
            borderRadius: 3,
            overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
            },
        }}
        >
            {food.image ? (
                <CardMedia
                    component="img"
                    height="180"
                    image={food.image}
                    alt={food.name}
                />
            ) : (
                 <Box
                    sx={{
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                    }}
                >
                    <Typography
                        variant="h3"
                        color="text.secondary"
                    >
                        🍛
                    </Typography>
                </Box>
            )}
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 1,
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {food.name}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            justifyContent: "flex-end",
                        }}
                    >
                        {food.mealTypes.map((mealType) => (
                            <Chip
                                key={mealType}
                                label={mealType}
                                size="small"
                                color="primary"
                            />
                        ))}
                    </Box>
                </Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                >
                    {food.calories} kcal
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, 1fr)",
                        gap: 1,
                    }}
                >
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Protein
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {food.protein}g
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Carbs
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {food.carbs}g
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Fat
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {food.fat}g
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}