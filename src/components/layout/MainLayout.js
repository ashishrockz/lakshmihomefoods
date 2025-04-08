import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header open={open} toggleDrawer={toggleDrawer} />
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      
      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          padding: 3,
          paddingTop: '64px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;