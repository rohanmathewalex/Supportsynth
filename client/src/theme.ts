import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            color: '#fff', // White text for all contained buttons
            backgroundColor: '#000', // Black background for all contained buttons
            '&:hover': {
              backgroundColor: '#333', // Darker on hover
            },
          },
          '&.MuiButton-outlined': {
            borderColor: '#000', // Black border for all outlined buttons
            color: '#000', // Black text for all outlined buttons
            '&:hover': {
              borderColor: '#333', // Darker border on hover
              backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light background on hover
              color: '#333', // Darker text on hover
            },
          },
        },
      },
    },
  },
});

export default theme;
