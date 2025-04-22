import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { logoutApi } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Header = ({ open, toggleDrawer }) => {
  const { user, setIsAuthenticated, setUser, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    await logoutApi();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          ForTeD Admin
        </Typography>
        {user && (
          <Box>
            <Typography variant="body1" component="span" sx={{ mr: 2 }}>
              {user.username} ({user.user_type})
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <Typography variant="body2">Logout</Typography>
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;