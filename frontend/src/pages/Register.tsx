import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";

import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
      });

      setSuccess(true);

      setTimeout(() => {navigate("/login");},100)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally{
      setLoading(false);
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
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        

        <Box component="form" onSubmit={handleSubmit}>

            <TextField
                fullWidth
                label="Name"
                type="text"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
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

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </Box>

        <Typography sx={{ mt: 3, textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
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
        Registration successful! Redirecting to login...
     </Alert>
    </Snackbar>
    </Box>
  );
}