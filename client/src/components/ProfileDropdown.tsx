import React from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); // Clear user info
    navigate('/'); // Redirect to homepage after logout
  };
  

  return (
    <Box>
      <Button color="inherit" onClick={handleOpen}>
        Welcome, {localStorage.getItem('username')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileDropdown;
