import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Collapse,
  Typography,
  Badge,
  Tooltip,
  useMediaQuery,
  IconButton,
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
  Warning as AlertIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 260;
const collapsedDrawerWidth = 65;

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Set initial state based on current route
  const isInProductsSection = location.pathname.includes('/products') || location.pathname.includes('/categories');
  const isInInventorySection =
    location.pathname.includes('/inventory') ||
    location.pathname.includes('/batches') ||
    location.pathname.includes('/low-stock');

  const [openProduct, setOpenProduct] = useState(isInProductsSection);
  const [openInventory, setOpenInventory] = useState(isInInventorySection);

  // Placeholder for low stock count (replace with API call in production)
  const lowStockCount = 5;

  useEffect(() => {
    // Update expanded sections when route changes
    if (isInProductsSection) setOpenProduct(true);
    if (isInInventorySection) setOpenInventory(true);
  }, [location.pathname]);

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) toggleDrawer();
  };

  const handleProductClick = () => {
    setOpenProduct(!openProduct);
  };

  const handleInventoryClick = () => {
    setOpenInventory(!openInventory);
  };

  const isActivePath = (path) => location.pathname === path;

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      active: isActivePath('/dashboard'),
    },
    {
      text: 'Products',
      icon: <ProductIcon />,
      subitems: [
        { text: 'All Products', path: '/products', active: isActivePath('/products') },
        { text: 'Categories', path: '/categories', active: isActivePath('/categories') },
      ],
    },
    {
      text: 'Inventory',
      icon: <InventoryIcon />,
      subitems: [
        { text: 'Inventory Items', path: '/inventory', active: isActivePath('/inventory') },
        { text: 'Batches', path: '/batches', active: isActivePath('/batches') },
        { text: 'Low Stock', path: '/low-stock', active: isActivePath('/low-stock'), badge: lowStockCount },
      ],
    },
    {
      text: 'Orders',
      icon: <OrderIcon />,
      path: '/orders',
      active: isActivePath('/orders'),
    },
    {
      text: 'Payments',
      icon: <PaymentIcon />,
      path: '/payments',
      active: isActivePath('/payments'),
    },
  ];

  if (user?.user_type === 'admin') {
    menuItems.push({
      text: 'Users',
      icon: <UserIcon />,
      path: '/users',
      active: isActivePath('/users'),
    });
  }

  const drawerVariant = isMobile ? 'temporary' : 'persistent';

  return (
    <Drawer
      variant={drawerVariant}
      anchor="left"
      open={open}
      onClose={isMobile ? toggleDrawer : undefined}
      sx={{
        width: open ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedDrawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper', // White background
          color: 'text.primary', // Dark text for visibility
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            px: open ? 2 : 1,
          }}
        >
          {open && (
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              FORTED ADMIN
            </Typography>
          )}
          <IconButton
            onClick={toggleDrawer}
            sx={{ color: 'text.primary' }}
            aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider sx={{ bgcolor: 'divider' }} />
        <List sx={{ flexGrow: 1, px: 1 }}>
          {menuItems.map((item) =>
            item.subitems ? (
              <React.Fragment key={item.text}>
                <Tooltip title={!open ? item.text : ''} placement="right" disableHoverListener={open}>
                  <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                    <ListItemButton
                      onClick={item.text === 'Products' ? handleProductClick : handleInventoryClick}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'grey.200',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: 'text.secondary',
                          minWidth: 0,
                          mr: open ? 2 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{ sx: { fontWeight: 500, color: 'text.primary' } }}
                          />
                          {item.text === 'Products' ? (
                            openProduct ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )
                          ) : openInventory ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                {open && (
                  <Collapse
                    in={item.text === 'Products' ? openProduct : openInventory}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subitems.map((subitem) => (
                        <Tooltip
                          key={subitem.text}
                          title={!open ? subitem.text : ''}
                          placement="right"
                          disableHoverListener={open}
                        >
                          <ListItemButton
                            onClick={() => handleNavigation(subitem.path)}
                            sx={{
                              pl: 4,
                              py: 1,
                              borderRadius: 1,
                              ml: 1,
                              bgcolor: subitem.active ? 'grey.300' : 'transparent',
                              '&:hover': {
                                bgcolor: 'grey.200',
                              },
                              mb: 0.5,
                            }}
                          >
                            <ListItemText
                              primary={subitem.text}
                              primaryTypographyProps={{
                                sx: {
                                  fontWeight: subitem.active ? 600 : 400,
                                  fontSize: '0.9rem',
                                  color: 'text.primary',
                                },
                              }}
                            />
                            {subitem.badge && (
                              <Badge
                                badgeContent={subitem.badge}
                                color="error"
                                sx={{
                                  '& .MuiBadge-badge': {
                                    fontSize: '0.75rem',
                                    height: 18,
                                    minWidth: 18,
                                  },
                                }}
                              />
                            )}
                          </ListItemButton>
                        </Tooltip>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ) : (
              <Tooltip key={item.text} title={!open ? item.text : ''} placement="right" disableHoverListener={open}>
                <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      borderRadius: 1,
                      bgcolor: item.active ? 'grey.300' : 'transparent',
                      '&:hover': {
                        bgcolor: 'grey.200',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'text.secondary',
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: item.active ? 600 : 500,
                            color: 'text.primary',
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            )
          )}
        </List>
        {open ? (
          <Box sx={{ p: 2, bgcolor: 'error.light', mx: 1, mb: 2, borderRadius: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation('/low-stock')}
              sx={{
                borderRadius: 1,
                p: 1,
                '&:hover': {
                  bgcolor: 'error.main',
                  '& .MuiListItemText-primary': { color: 'white' },
                  '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'error.dark', minWidth: 40 }}>
                <AlertIcon />
              </ListItemIcon>
              <ListItemText
                primary="Low Stock Alert"
                secondary={`${lowStockCount} items need attention`}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 600,
                  color: 'error.dark',
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary',
                }}
              />
              <Badge
                badgeContent={lowStockCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    height: 18,
                    minWidth: 18,
                  },
                }}
              />
            </ListItemButton>
          </Box>
        ) : (
          <Tooltip title={`Low Stock Alert: ${lowStockCount} items`} placement="right">
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, mb: 2, mx: 'auto' }}>
              <Badge
                badgeContent={lowStockCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    height: 18,
                    minWidth: 18,
                  },
                }}
              >
                <IconButton
                  sx={{ color: 'error.main' }}
                  onClick={() => handleNavigation('/low-stock')}
                  aria-label="Low stock alert"
                >
                  <AlertIcon />
                </IconButton>
              </Badge>
            </Box>
          </Tooltip>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;