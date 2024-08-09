import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Welcome to SupportSynth!
        </Typography>
        <Typography variant="subtitle1">
          Discover how our AI-driven solutions enhance your customer service
          experience. Engage with our demo and see the difference!
        </Typography>
      </Box>
      <Footer />
    </Container>
  );
};

export default HomePage;
