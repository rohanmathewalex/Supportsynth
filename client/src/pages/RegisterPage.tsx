// Import necessary hooks and components
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

// Define the expected structure of the error response
interface ErrorResponse {
  message: string; // Assuming the backend sends error messages in this format
}

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "https://supportsynth.onrender.com/api/auth/register",
        {
          username,
          password,
        }
      );
      // Registration was successful, now navigate to the login page
      navigate("/chat", { replace: true });
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>; // Use the ErrorResponse interface
      if (error.response) {
        setError(error.response.data.message); // Now TypeScript knows error.response.data has a message property
      } else if (error.request) {
        setError("No response from server");
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 300, mx: "auto", mt: 5 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Register for SupportSynth
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        onClick={handleRegister}
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </Box>
  );
};

export default RegisterPage;
