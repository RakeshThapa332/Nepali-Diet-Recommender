import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import FoodFilters from "../components/food/FoodFilters";
import FoodGrid from"../components/food/FoodGrid";
import type {
  FoodCardData
} from "../components/food/FoodCard";
import { getFoods } from "../services/foodService";

export default function FoodExplorer() {
  const [foods, setFoods] = useState<FoodCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    getFoods()
      .then((data) => {
        if (isMounted) setFoods(data);
      })
      .catch(() => {
        if (isMounted) setError("Failed to load foods.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ["Breakfast", "Lunch", "Dinner"];

  const filteredFoods = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesSearch = 
      food.name.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "all" || food.mealTypes.includes(category);

      return (
        matchesSearch && 
        matchesCategory
      );
    });
  }, [foods, search, category]);

  if (loading) {
    return <Typography>Loading foods...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
            
            <FoodFilters
                search={search}
                category={category}
                categories={categories}
                onSearchChange={setSearch}
                onCategoryChange={setCategory}
            />

            <FoodGrid foods={filteredFoods} />
        </Box>
  );
}