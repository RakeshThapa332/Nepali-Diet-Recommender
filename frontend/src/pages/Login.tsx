import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";
import { Box, Typography, Button, TextField, Paper, Alert, Snackbar} from "@mui/material";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const[success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await loginUser({
                email,
                password,
            });

            login(data.access_token, data.user);
            setSuccess(true);

            setTimeout(() => {navigate("/dashboard");},1000)

        }catch (err: any) {
            setError(
                err.response?.data?.message || "Invalid email or password."
            );
        }
    };
    return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" mb={3} fontWeight={700}>
          Welcome Back
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>

        <Typography mt={3} textAlign="center">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </Typography>
      </Paper>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
        <Alert
            onClose={() => setSuccess(false)}
             severity="success"
            variant="filled"
            sx={{ width: "100%" }}
        >
            Login successful! Welcome back.
             </Alert>
        </Snackbar>
    </Box>
  );
}