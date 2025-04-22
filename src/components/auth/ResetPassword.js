import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/auth.service';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await resetPassword(uidb64, token, newPassword);
      setSuccess('Password reset successfully');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err || 'Password reset failed');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;