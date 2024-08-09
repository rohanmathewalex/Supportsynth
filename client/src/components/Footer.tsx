import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, borderTop: '1px solid #ccc', marginTop: 2 }}>
      <Typography variant="body2">
        © 2024 SupportSynth, Rohan Mathew Alex. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
