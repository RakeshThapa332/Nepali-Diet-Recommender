import { Box, Card, Skeleton } from "@mui/material";

interface LoadingProps {
  variant?: "dashboard" | "card" | "page";
}

export default function Loading({
  variant = "dashboard",
}: LoadingProps) {
  if (variant === "card") {
    return (
      <Card
        sx={{
          p: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="70%" />
        <Skeleton
          variant="rectangular"
          height={80}
          sx={{ mt: 1, borderRadius: 1.5 }}
        />
      </Card>
    );
  }

  if (variant === "page") {
    return (
      <Box>
        <Skeleton
          variant="text"
          width={220}
          height={40}
        />

        <Skeleton
          variant="text"
          width={350}
          height={24}
          sx={{ mb: 3 }}
        />

        <Skeleton
          variant="rectangular"
          height={300}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    );
  }

  // Dashboard skeleton
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton
          variant="text"
          width={280}
          height={40}
        />
        <Skeleton
          variant="text"
          width={220}
          height={24}
        />
      </Box>

      {/* Statistics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            sx={{
              p: 2,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <Skeleton variant="text" width="55%" />
            <Skeleton variant="text" width="45%" height={32} />
            <Skeleton variant="text" width="75%" />
          </Card>
        ))}
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          mb: 2,
        }}
      >
        <Card
          sx={{
            p: 2,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            boxShadow: "none",
          }}
        >
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton
            variant="circular"
            width={160}
            height={160}
            sx={{ mx: "auto", my: 2 }}
          />
        </Card>

        <Card
          sx={{
            p: 2,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            boxShadow: "none",
          }}
        >
          <Skeleton variant="text" width="45%" height={28} />

          {Array.from({ length: 4 }).map((_, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Skeleton variant="text" width="35%" />
              <Skeleton
                variant="rounded"
                height={7}
                sx={{ borderRadius: 5 }}
              />
            </Box>
          ))}
        </Card>
      </Box>

      {/* Nutrition Summary */}
      <Card
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <Skeleton variant="text" width="180px" height={28} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(4, 1fr)",
            },
            gap: 2,
            mt: 1,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Box key={index}>
              <Skeleton variant="text" width="45%" />
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="70%" />
            </Box>
          ))}
        </Box>
      </Card>

      {/* Meal Plan */}
      <Card
        sx={{
          p: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <Skeleton variant="text" width="220px" height={30} />
        <Skeleton variant="text" width="280px" />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 1.25,
            mt: 2,
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              sx={{
                p: 1.25,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                boxShadow: "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1.25,
                  alignItems: "center",
                }}
              >
                <Skeleton
                  variant="rounded"
                  width={56}
                  height={56}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="75%" />
                  <Skeleton variant="text" width="45%" />
                  <Skeleton variant="text" width="65%" />
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Card>
    </Box>
  );
}