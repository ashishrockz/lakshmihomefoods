import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCards = ({ stat }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.light',
            width: 40,
            height: 40,
            mr: 2,
          }}
        >
          {stat.icon}
        </Avatar>
        <Typography variant="subtitle1" color="text.secondary">
          {stat.title}
        </Typography>
      </Box>
      
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        {stat.value}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {stat.up ? (
          <TrendingUp color="success" fontSize="small" sx={{ mr: 1 }} />
        ) : (
          <TrendingDown color="error" fontSize="small" sx={{ mr: 1 }} />
        )}
        
        <Typography 
          variant="body2"
          color={stat.up ? 'success.main' : 'error.main'}
          fontWeight="medium"
        >
          {stat.change}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          vs last week
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCards;