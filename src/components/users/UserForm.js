import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import useAxios from '../../hooks/useAxios';
import config from '../../config';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isEdit) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/users/${id}`);
      const { password, ...userData } = response.data; // Exclude password from edit form
      setFormData(userData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching user data',
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.role) tempErrors.role = 'Role is required';
    if (!isEdit && !formData.password) tempErrors.password = 'Password is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await axios.put(`${config.API_URL}/users/${id}`, formData);
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post(`${config.API_URL}/users/`, formData);
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success'
        });
      }
      setTimeout(() => navigate('/users'), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error saving user',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {isEdit ? 'Edit User' : 'Create New User'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={!!errors.role}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="STAFF">Staff</MenuItem>
            </Select>
            {errors.role && (
              <Typography variant="caption" color="error">
                {errors.role}
              </Typography>
            )}
          </FormControl>

          {!isEdit && (
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
            />
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="is_active"
              value={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
            >
              {isEdit ? 'Update User' : 'Create User'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserForm;