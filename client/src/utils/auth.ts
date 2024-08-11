// utils/auth.js

// Import the jwtDecode function directly
import { jwtDecode } from 'jwt-decode';


export const getUsernameFromToken = () => {
  const token = localStorage.getItem('token'); // Get the JWT from localStorage
  if (token) {
    const decodedToken = jwtDecode(token); // Decode the token
    return decodedToken // Return the username part of the decoded token
  }
  return null; // Return null if no token is present
};
