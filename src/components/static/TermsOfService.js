import React from 'react';
import { Box, Typography } from '@mui/material';

const TermsOfService = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Terms of Service
      </Typography>
      <Typography variant="body1">
        Your terms of service content goes here.
      </Typography>
    </Box>
  );
};

export default TermsOfService;