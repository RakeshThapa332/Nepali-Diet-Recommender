import {
    Box,
    Typography,
} from "@mui/material";
 
import FoodCard from "./FoodCard";

import type { FoodCardData } from "./FoodCard";

interface FoodGridProps {
    foods: FoodCardData[];
}

export default function FoodGRid({
    foods,
}: FoodGridProps) {
    if (foods.length == 0) {
        return (
            <Box
                sx={{
                    py: 8,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{fontWeight:600}}
                    gutterBottom
                >
                    No foods found
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Try changing your search or category.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                },
                gap: 3,
            }}
        > 
        {foods.map((food) => (
                <FoodCard
                    key={food.id}
                    food={food}
                />
            ))}</Box>
    );
}