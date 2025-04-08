import React from 'react';
import { Box, useTheme } from '@mui/material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const RevenueChart = ({ data }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ height: 350, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => `$${value}`} 
          />
          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke={theme.palette.primary.main} 
            fill={theme.palette.primary.light} 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;
