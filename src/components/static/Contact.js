import React from 'react';
import { Box, Typography } from '@mui/material';

const Contact = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1">
        Your contact information goes here.
      </Typography>
    </Box>
  );
};

export default Contact;