import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setOpenSnackbar(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setOpenSnackbar(true);
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.current_password?.[0] || 
                      error.response?.data?.new_password?.[0] ||
                      error.response?.data?.detail ||
                      'Password change failed. Please try again.';
      setError(message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Update your password to keep your account secure.
      </Typography>
      
      <Box sx={{ maxWidth: 600, mt: 3 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Current Password"
                  variant="outlined"
                  fullWidth
                  required
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  required
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <TextField
                  label="Confirm New Password"
                  variant="outlined"
                  fullWidth
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={newPassword !== confirmPassword && confirmPassword.length > 0}
                  helperText={
                    newPassword !== confirmPassword && confirmPassword.length > 0
                      ? 'Passwords do not match'
                      : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={success ? "success" : "error"} 
          sx={{ width: '100%' }}
        >
          {success ? 'Password updated successfully!' : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;