import {
    Box,
    TextField,
    MenuItem,
} from "@mui/material";

interface FoodFiltersProps {
    search: string;
    category: string;
    categories: string[];
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

export default function foodFilters({
    search,
    category,
    categories,
    onSearchChange,
    onCategoryChange,
}: FoodFiltersProps) {
    return (
        <Box
        sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr",
            },
            gap:2,
            mb:3,
        }}
        >
            <TextField
                fullWidth
                label="Search food"
                placeholder="Search Nepali foods..."
                value={search}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
            />

             <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(event) =>
                    onCategoryChange(event.target.value)
                }
            >
                <MenuItem value="all">
                    All Categories
                </MenuItem>

                 {categories.map((item) => (
                    <MenuItem key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
}