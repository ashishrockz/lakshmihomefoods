import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Box,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = ({ open, toggleDrawer }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };
  
  const handleChangePassword = () => {
    navigate('/change-password');
    handleMenuClose();
  };
  
  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };
  
  return (
    <AppBar
      position="fixed"
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        >
          ForTeD Admin Portal
        </Typography>
        
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsMenuOpen}
            >
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account settings">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.username?.charAt(0)?.toUpperCase() || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" sx={{ 
              display: 'inline-block',
              px: 1,
              py: 0.5,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 1,
              mt: 1
            }}>
              {user?.role}
            </Typography>
          </Box>
          
          <MenuItem onClick={handleProfile}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          
          <MenuItem onClick={handleChangePassword}>
            <LockIcon sx={{ mr: 2 }} />
            Change Password
          </MenuItem>
          
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
        
        <Menu
          id="notifications-menu"
          anchorEl={notificationsAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsMenuClose}
        >
          <Box sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
            <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #eee' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            
            <MenuItem onClick={handleNotificationsMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Low stock alert
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  5 products are running low on stock
                </Typography>
              </Box>
            </MenuItem>
            
            <MenuItem onClick={handleNotificationsMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  New order received
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Order #ORD-3A7BC9D2 was placed
                </Typography>
              </Box>
            </MenuItem>
            
            <MenuItem onClick={handleNotificationsMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Payment confirmed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Payment for order #ORD-12E45F6A was confirmed
                </Typography>
              </Box>
            </MenuItem>
            
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography 
                variant="body2" 
                color="primary"
                sx={{ cursor: 'pointer' }}
              >
                See all notifications
              </Typography>
            </Box>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;