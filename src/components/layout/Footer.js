import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          © {currentYear} ForTeD Admin Portal. All rights reserved.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' },
          }}
        >
          <Link
            component={RouterLink}
            to="/privacy-policy"
            color="text.secondary"
            variant="body2"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Privacy Policy
          </Link>
          <Link
            component={RouterLink}
            to="/terms-of-service"
            color="text.secondary"
            variant="body2"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Terms of Service
          </Link>
          <Link
            component={RouterLink}
            to="/contact"
            color="text.secondary"
            variant="body2"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Contact Us
          </Link>
        </Box>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="center"
        sx={{ mt: 1 }}
      >
        Built with ❤️ by the ForTeD Team
      </Typography>
    </Box>
  );
};

export default Footer;