import {
    ArrowForward,
    RestaurantMenuOutlined,
    SearchOutlined,
    TrendingUpOutlined,
} from "@mui/icons-material";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const features = [
    {
        icon: <RestaurantMenuOutlined />,
        title: "Personalized Diet",
        description:"Get meal recommendations based on your body measurements, activity level, and health goals.",
    },
    {
        icon: <SearchOutlined />,
        title: "Nepali Food Database",
        description:"Explore nutritional information for popular Nepali foods and discover healthier choices."
    },
    {
        icon: <TrendingUpOutlined />,
        title: "Track Your Progress",
        description: "Monitor your nutrition, meals, and progress toward your personal goals."
    },
];

export default function Landing(){
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
            }}
        >
            {/* Navbar */}
            <Box
                component="nav"
                sx={{
                    height: 72,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                            }}
                        >
                            <RestaurantMenuOutlined />
                        </Box>

                        <Box>
                            <Typography
                                fontWeight={700}
                                lineHeight={1.1}
                            >
                                Nepali Diet
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Recommender
                            </Typography>
                        </Box>
                    </Box>

                    {/* Desktop navigation */}
                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex",
                            },
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Button
                            color="inherit"
                            onClick={() =>
                                document
                                    .getElementById("features")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            Features
                        </Button>

                        <Button
                            color="inherit"
                            onClick={() =>
                                document
                                    .getElementById("how-it-works")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            How It Works
                        </Button>

                        <Button
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Get Started
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Hero */}
            <Box
                component="section"
                sx={{
                    py: {
                        xs: 8,
                        md: 12,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Grid
                        container
                        spacing={6}
                        alignItems="center"
                    >
                        <Grid
                            size={{
                                xs: 12,
                                md: 7,
                            }}
                        >
                            <Typography
                                variant="overline"
                                color="primary"
                                fontWeight={700}
                                letterSpacing={1.5}
                            >
                                SMART NUTRITION FOR EVERYDAY LIFE
                            </Typography>

                            <Typography
                                variant="h1"
                                fontWeight={800}
                                sx={{
                                    fontSize: {
                                        xs: "2.5rem",
                                        sm: "3.5rem",
                                        md: "4.2rem",
                                    },
                                    lineHeight: 1.1,
                                    mt: 1,
                                    mb: 3,
                                }}
                            >
                                Eat better.
                                <br />
                                <Box
                                    component="span"
                                    color="primary.main"
                                >
                                    Live healthier.
                                </Box>
                            </Typography>

                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{
                                    maxWidth: 620,
                                    lineHeight: 1.7,
                                    fontWeight: 400,
                                    mb: 4,
                                }}
                            >
                                Get personalized diet recommendations
                                using the foods you already know and love.
                                Discover healthier Nepali meals based on
                                your nutritional needs and goals.
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    color="primary"
                                    endIcon={<ArrowForward />}
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    sx={{
                                        px: 3,
                                        py: 1.4,
                                        borderRadius: 2,
                                    }}
                                >
                                    Get Started
                                </Button>


                            </Box>
                        </Grid>

                        {/* Hero visual */}
                        <Grid
                            size={{
                                xs: 12,
                                md: 5,
                            }}
                        >
                            <Box
                                sx={{
                                    minHeight: 380,
                                    borderRadius: 5,
                                    bgcolor: "primary.main",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "8rem",
                                            md: "11rem",
                                        },
                                    }}
                                >
                                    🥗
                                </Typography>

                                <Card
                                    sx={{
                                        position: "absolute",
                                        bottom: 24,
                                        left: 24,
                                        right: 24,
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            YOUR DAILY NUTRITION
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                        >
                                            Personalized for you
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* Features */}
            <Box
                id="features"
                component="section"
                sx={{
                    py: 10,
                    bgcolor: "background.paper",
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            textAlign: "center",
                            mb: 6,
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={700}
                            gutterBottom
                        >
                            Everything you need to eat better
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                maxWidth: 650,
                                mx: "auto",
                            }}
                        >
                            Simple tools designed to make healthy eating
                            easier and more personalized.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {features.map((feature) => (
                            <Grid
                                key={feature.title}
                                size={{
                                    xs: 12,
                                    md: 4,
                                }}
                            >
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: 3,
                                        border: 1,
                                        borderColor: "divider",
                                        boxShadow: "none",
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor:
                                                    "action.hover",
                                                color: "primary.main",
                                                mb: 2,
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>

                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            gutterBottom
                                        >
                                            {feature.title}
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            lineHeight={1.7}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How it works */}
            <Box
                id="how-it-works"
                component="section"
                sx={{
                    py: 10,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            textAlign: "center",
                            mb: 6,
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={700}
                            gutterBottom
                        >
                            How it works
                        </Typography>

                        <Typography color="text.secondary">
                            Start your personalized nutrition journey
                            in three simple steps.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {[
                            {
                                number: "01",
                                title: "Create your profile",
                                text: "Enter your basic information, activity level, and nutrition goal.",
                            },
                            {
                                number: "02",
                                title: "Get your recommendations",
                                text: "Our system calculates your nutritional needs and creates a personalized diet plan.",
                            },
                            {
                                number: "03",
                                title: "Track your progress",
                                text: "Follow your meal plan and keep track of your nutrition over time.",
                            },
                        ].map((step) => (
                            <Grid
                                key={step.number}
                                size={{
                                    xs: 12,
                                    md: 4,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h3"
                                        color="primary"
                                        fontWeight={800}
                                    >
                                        {step.number}
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{ mt: 1 }}
                                    >
                                        {step.title}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {step.text}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA */}
            <Box
                component="section"
                sx={{
                    py: 8,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={700}
                            gutterBottom
                        >
                            Ready to build a healthier routine?
                        </Typography>

                        <Typography
                            sx={{
                                opacity: 0.9,
                                mb: 4,
                            }}
                        >
                            Start discovering personalized Nepali
                            nutrition recommendations today.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() =>
                                navigate("/register")
                            }
                            sx={{
                                bgcolor: "background.paper",
                                color: "primary.main",
                                px: 4,
                                py: 1.4,
                                "&:hover": {
                                    bgcolor: "background.paper",
                                },
                            }}
                        >
                            Create Your Account
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    bgcolor: "background.paper",
                    borderTop: 1,
                    borderColor: "divider",
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                    >
                        © 2026 Nepali Diet Recommender. Eat well,
                        live well.
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}