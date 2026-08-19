import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import { deleteAccount } from "../../services/authService";

export default function DeleteAccount() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setError("");
    setDeleting(true);

    try {
      await deleteAccount(password);
      logout();
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete your account."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <Dialog open={open} onClose={() => !deleting && setOpen(false)}>
        <DialogTitle>Delete account permanently?</DialogTitle>
        <DialogContent>
          All profile, meal plan, intake, notification, and recommendation data
          will be deleted.
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            label="Confirm password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={!password || deleting}
          >
            Delete permanently
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
