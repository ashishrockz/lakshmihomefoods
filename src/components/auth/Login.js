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
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic input validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setOpenSnackbar(true);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      setOpenSnackbar(true);
      return;
    }
  
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid credentials';
      setError(message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        backgroundImage: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '80%',
          maxWidth: '1000px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <Paper
          sx={{
            flex: '0 0 40%',
            bgcolor: 'primary.main',
            color: 'white',
            p: 5,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={3}>
            ForTeD Admin
          </Typography>
          <Typography variant="body1" mb={4}>
            Welcome to the ForTeD Pickle Admin Portal. Log in to manage your products, inventory, orders, and more.
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="caption">
              © 2025 ForTeD Pickles. All rights reserved.
            </Typography>
          </Box>
        </Paper>
        
        <Card sx={{ flex: '1 1 auto', borderRadius: 0 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" fontWeight="bold">
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to access the admin portal
              </Typography>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
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
               sx={{ mb: 2 }}
               startIcon={loading && <CircularProgress size={20} color="inherit" />}
             >{loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <Typography variant="body2" align="center">
                <Link to="/forgot-password" style={{ color: 'inherit' }}>
                  Forgot Password?
                </Link>
              </Typography>
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
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;