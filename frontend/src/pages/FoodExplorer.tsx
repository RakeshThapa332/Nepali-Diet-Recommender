import { useMemo, useState } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import FoodFilters from "../components/food/FoodFilters";
import FoodGrid from"../components/food/FoodGrid";
import type {
  FoodCardData
} from "../components/food/FoodCard";

const foods: FoodCardData[] = [
  {
    id: 1,
    name: "Dal Bhat",
    category:"Main Course",
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

export default function FoodExplorer() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo (
  () =>
    Array.from(
      new Set(
        foods.map(
          (food) => food.category
        )
      )
    ),
    []
  );

  const filteredFoods = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesSearch = 
      food.name.toLowerCase().includes(searchValue);

      const matchesCategory = category === "all" || food.category === category;

      return (
        matchesSearch && 
        matchesCategory
      );
    });
  }, [search, category]);

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