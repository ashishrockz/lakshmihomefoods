import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const setAuth = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Login response:', response.data);
  
      if (response.data.access) {
        const userType = response.data.user_type;
        if (!userType || userType === 'admin') {
          setAuth(response.data.access);
          navigate('/');
        } else {
          setError('Access denied: Only admins can access the dashboard');
          localStorage.clear();
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      let errorMessage = 'Invalid credentials';
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.error || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Admin Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            disabled={loading}
            error={!!error}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            disabled={loading}
            error={!!error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;