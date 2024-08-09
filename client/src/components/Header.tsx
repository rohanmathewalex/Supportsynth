import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Header: React.FC = () => {
  const isLoggedIn = Boolean(localStorage.getItem("username"));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h6">SupportSynth</Typography>
      {isLoggedIn ? (
        <ProfileDropdown />
      ) : (
        <Box>
          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              marginRight: 2,
              "&:hover": {
                backgroundColor: "#333", // Darker on hover
                color: "#fff", // Ensure text remains white
              },
            }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/register"
            sx={{
              borderColor: "#000",
              color: "#000",
              "&:hover": {
                borderColor: "#333", // Darker border on hover
                backgroundColor: "rgba(0, 0, 0, 0.04)", // Slight background color on hover
                color: "#333", // Darker text on hover
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
