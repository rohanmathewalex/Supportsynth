import React, { useState, useEffect } from "react";
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

interface Session {
  messages: Message[];
}

const ChatPage: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Session[]>([]);
  const [currentChat, setCurrentChat] = useState<Message[]>([
    { id: 0, sender: "bot", content: "Hello, how can I assist you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/chat/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setChatHistory(data.sessions || []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const newMessageObj: Message = {
        id: currentChat.length,
        sender: "user",
        content: newMessage,
      };

      setCurrentChat([...currentChat, newMessageObj]);
      setNewMessage("");

      if (uploadedFile) {
        // Handle document upload and query together
        handleUploadAndAnalyze();
      } else {
        // Handle normal text query
        try {
          const response = await fetch("http://localhost:5000/api/chat/respond", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ message: newMessageObj.content }),
          });

          const data = await response.json();

          if (response.ok) {
            const aiMessageObj: Message = {
              id: currentChat.length + 1,
              sender: "bot",
              content: data.response,
            };
            setCurrentChat((prevChat) => [...prevChat, aiMessageObj]);
          } else {
            console.error("Failed to get AI response:", data.error);
          }
        } catch (error) {
          console.error("Error during message sending:", error);
        }
      }
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("query", newMessage);

    try {
      const response = await fetch("http://localhost:5000/api/upload/upload-and-query", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const aiMessageObj: Message = {
          id: currentChat.length + 1,
          sender: "bot",
          content: result.answer,
        };
        setCurrentChat((prevChat) => [...prevChat, aiMessageObj]);
      } else {
        console.error("Failed to get AI response:", result.error);
      }
    } catch (error) {
      console.error("Error uploading and analyzing document:", error);
    } finally {
      // Clear uploaded file after processing
      setUploadedFile(null);
    }
  };

  const handleEndChat = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messages: currentChat }),
      });

      if (response.ok) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { messages: currentChat },
        ]);
        setCurrentChat([
          { id: 0, sender: "bot", content: "How can I assist you today?" },
        ]);
      } else {
        console.error("Failed to end chat session");
      }
    } catch (error) {
      console.error("Error ending chat session:", error);
    }
  };

  const handleClearHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setChatHistory([]);
        setCurrentChat([
          {
            id: 0,
            sender: "bot",
            content: "Hello, how can I assist you today?",
          },
        ]);
      } else {
        console.error("Failed to clear chat history");
      }
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const messageStyle = (sender: string) => ({
    display: "flex",
    justifyContent: sender === "user" ? "flex-end" : "flex-start",
    padding: 1,
    marginBottom: 2,
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    backgroundColor: sender === "user" ? "rgba(76, 175, 80, 0.3)" : "rgba(0, 0, 255, 0.1)",
    borderRadius: "10px",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadedFile(file || null);
  };

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
          <Button
            onClick={handleClearHistory}
            sx={{ margin: 2 }}
            variant="contained"
            color="error"
          >
            Clear History
          </Button>
          <List>
            {chatHistory.map((session, index) => (
              <ListItem
                button
                key={index}
                sx={{
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  margin: "5px",
                  borderRadius: "5px",
                }}
                onClick={() => setCurrentChat(session.messages)}
              >
                <ListItemText
                  primary={`Chat ${index + 1}`}
                  secondary={session.messages[0]?.content || "No messages"}
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
                <input type="file" hidden onChange={handleFileChange} />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
              >
                Send
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEndChat}
                sx={{ ml: 2 }}
              >
                End Chat
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
