import React from 'react';
import { Box, Typography } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1">
        Your privacy policy content goes here.
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;