import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Divider,
  Box,
  Collapse,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  Payment as PaymentIcon,
  People as UserIcon,
  ExpandLess,
  ExpandMore,
  Store as ProductIcon,
  Warning as AlertIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const drawerWidth = 260;

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const [openProduct, setOpenProduct] = useState(true);
  const [openInventory, setOpenInventory] = useState(true);
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  const handleProductClick = () => {
    setOpenProduct(!openProduct);
  };
  
  const handleInventoryClick = () => {
    setOpenInventory(!openInventory);
  };
  
  const isActivePath = (path) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      active: isActivePath('/dashboard')
    },
    {
      text: 'Products',
      icon: <ProductIcon />,
      subitems: [
        {
          text: 'All Products',
          path: '/products',
          active: isActivePath('/products')
        },
        {
          text: 'Categories',
          path: '/categories',
          active: isActivePath('/categories')
        }
      ]
    },
    {
      text: 'Inventory',
      icon: <InventoryIcon />,
      subitems: [
        {
          text: 'Inventory Items',
          path: '/inventory',
          active: isActivePath('/inventory')
        },
        {
          text: 'Batches',
          path: '/batches',
          active: isActivePath('/batches')
        },
        {
          text: 'Low Stock',
          path: '/low-stock',
          active: isActivePath('/low-stock')
        }
      ]
    },
    {
      text: 'Orders',
      icon: <OrderIcon />,
      path: '/orders',
      active: isActivePath('/orders')
    },
    {
      text: 'Payments',
      icon: <PaymentIcon />,
      path: '/payments',
      active: isActivePath('/payments')
    }
  ];
  
  // Only add users section for admin
  if (isAdmin) {
    menuItems.push({
      text: 'Users',
      icon: <UserIcon />,
      path: '/users',
      active: isActivePath('/users')
    });
  }
  
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ height: 64 }} /> {/* Space for the AppBar */}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            FORTED ADMIN
          </Typography>
        </Box>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            item.subitems ? (
              <React.Fragment key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={item.text === 'Products' ? handleProductClick : handleInventoryClick}
                    sx={{ 
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.text === 'Products' ? 
                      (openProduct ? <ExpandLess /> : <ExpandMore />) :
                      (openInventory ? <ExpandLess /> : <ExpandMore />)
                    }
                  </ListItemButton>
                </ListItem>
                
                <Collapse 
                  in={item.text === 'Products' ? openProduct : openInventory} 
                  timeout="auto" 
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subitems.map(subitem => (
                      <ListItemButton 
                        key={subitem.text}
                        onClick={() => handleNavigation(subitem.path)}
                        sx={{ 
                          pl: 4,
                          color: 'white',
                          bgcolor: subitem.active ? 'rgba(255,255,255,0.2)' : 'transparent',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        <ListItemText primary={subitem.text} />
                        {subitem.text === 'Low Stock' && (
                          <Box
                            sx={{
                              bgcolor: 'error.main',
                              color: 'white',
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          >
                            5
                          </Box>
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  sx={{ 
                    color: 'white',
                    bgcolor: item.active ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )
          ))}
        </List>
        
        <Box sx={{ p: 2, bgcolor: 'rgba(255,0,0,0.1)' }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/low-stock')}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <AlertIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Low Stock Alert" 
                secondary="5 items need attention"
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ 
                  variant: 'caption', 
                  color: 'rgba(255,255,255,0.7)' 
                }}
              />
              <Box
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                5
              </Box>
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;