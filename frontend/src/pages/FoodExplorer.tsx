import { useEffect, useState } from "react";

import {
  Box,
  Pagination,
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const meal = category === "all" ? undefined : category.toLowerCase();

    setLoading(true);
    getFoods(search.trim() || undefined, meal, page)
      .then(({ foods: loadedFoods, pagination }) => {
        if (isMounted) {
          setFoods(loadedFoods);
          setTotalPages(pagination.pages);
        }
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
  }, [search, category, page]);

  const categories = ["Breakfast", "Lunch", "Dinner"];

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
                onSearchChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                onCategoryChange={(value) => {
                  setCategory(value);
                  setPage(1);
                }}
            />

            <FoodGrid foods={foods} />

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, selectedPage) => setPage(selectedPage)}
                  color="primary"
                  showFirstButton
                  showLastButton
                  aria-label="Food pages"
                />
              </Box>
            )}
        </Box>
  );
}