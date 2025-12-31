'use client';

import { Box, Typography, IconButton, Breadcrumbs, Link } from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

export default function Header() {
  return (
    <Box
      sx={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          href="/"
          sx={{ fontSize: '0.875rem', color: '#666' }}
        >
          Dashboard
        </Link>
        <Typography sx={{ fontSize: '0.875rem', color: '#222222', fontWeight: 500 }}>
          Services
        </Typography>
      </Breadcrumbs>

      {/* Icons */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton size="small" sx={{ color: '#222222' }}>
          <EmailIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: '#222222' }}>
          <NotificationsIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: '#222222' }}>
          <AccountCircleIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

