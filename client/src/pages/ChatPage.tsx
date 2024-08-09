import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Card,
  CardContent,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  sender: "user" | "bot";
  content: string;
}

const ChatPage: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Message[]>([
    { id: 0, sender: "bot", content: "Hello, how can I assist you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj: Message = {
        id: currentChat.length,
        sender: "user",
        content: newMessage,
      };
      setCurrentChat([...currentChat, newMessageObj]);
      setNewMessage("");
    }
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.removeItem("token"); // Remove the authentication token
    navigate("/login"); // Redirect to the login page
  };

  const messageStyle = (sender: string) => ({
    display: "flex",
    justifyContent: sender === "user" ? "flex-end" : "flex-start",
    padding: 1,
    marginBottom: 2,
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    backgroundColor:
      sender === "user" ? "rgba(76, 175, 80, 0.3)" : "rgba(0, 0, 255, 0.1)", // Green for user, light blue for bot
    borderRadius: "10px",
  });

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">SupportSynth</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ marginRight: 2 }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography variant="h6">Welcome, User!</Typography>
            <IconButton onClick={handleLogout} sx={{ marginLeft: 2 }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={2}
        sx={{ flexGrow: 1, overflow: "hidden", marginBottom: "60px" }}
      >
        <Grid
          item
          xs={3}
          sx={{ overflowY: "auto", boxShadow: "2px 0px 5px rgba(0,0,0,0.1)" }}
        >
          <Typography variant="h6" sx={{ padding: 2 }}>
            Chat History
          </Typography>
          <List>
            {chatHistory.map((msg, index) => (
              <ListItem
                button
                key={index}
                sx={{
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  margin: "5px",
                  borderRadius: "5px",
                }}
              >
                <ListItemText
                  primary={`Chat ${msg.id}`}
                  secondary={msg.content.substring(0, 30) + "..."}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: 2,
            }}
          >
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {currentChat.map((msg, index) => (
                <Box key={index} sx={messageStyle(msg.sender)}>
                  <Typography align={msg.sender === "user" ? "right" : "left"}>
                    {msg.content}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid #ccc",
                padding: 1,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mr: 1 }}
              />
              <IconButton color="primary" component="label" sx={{ p: "10px" }}>
                <CloudUploadIcon />
                <input type="file" hidden />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          p: 2,
          mt: "auto",
          backgroundColor: "#f5f5f5",
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        © 2024 SupportSynth. All rights reserved.
      </Box>
    </Box>
  );
};

export default ChatPage;
