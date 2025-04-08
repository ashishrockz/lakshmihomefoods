import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Snackbar } from '@mui/material';
import { requestPasswordReset } from '../../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setSnackbar({ open: true, message: 'Password reset email sent', severity: 'success' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error sending reset email',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enter your email to receive a password reset link.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Send Reset Link
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;