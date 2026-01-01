'use client';

import { usePathname } from 'next/navigation';
import { Box, Typography, IconButton, Breadcrumbs, Link, useMediaQuery, useTheme } from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onDrawerToggle?: () => void;
}

// Breadcrumb mapping based on routes
const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Services',
  '/clients': 'Clients',
  '/service-orders': 'Service Orders',
  '/esignature': 'eSignature',
  '/messages': 'Messages',
  '/invoices': 'Invoices & Receipts',
  '/specialists/create': 'Create Specialist',
};

// Get breadcrumb label from pathname
const getBreadcrumbLabel = (pathname: string): string => {
  // Check for exact match first
  if (breadcrumbMap[pathname]) {
    return breadcrumbMap[pathname];
  }
  
  // Check for dynamic routes (e.g., /specialists/edit/[id])
  if (pathname.startsWith('/specialists/edit/')) {
    return 'Edit Specialist';
  }
  
  // Default fallback - capitalize first letter and remove slashes
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    return segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return 'Dashboard';
};

export default function Header({ onDrawerToggle }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const breadcrumbLabel = getBreadcrumbLabel(pathname);

  return (
    <Box
      sx={{
        height: { xs: 56, sm: 64 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && onDrawerToggle && (
        <IconButton
          onClick={onDrawerToggle}
          sx={{ color: '#222222', mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Breadcrumb */}
      <Breadcrumbs 
        separator="›" 
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap',
          },
        }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
            color: '#666',
            whiteSpace: 'nowrap',
          }}
        >
          Dashboard
        </Link>
        <Typography sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
          color: '#222222', 
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {breadcrumbLabel}
        </Typography>
      </Breadcrumbs>

      {/* Icons */}
      <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'center' }}>
        {!isMobile && (
          <>
            <IconButton size="small" sx={{ color: '#222222' }}>
              <EmailIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#222222' }}>
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </>
        )}
        <IconButton size="small" sx={{ color: '#222222' }}>
          <AccountCircleIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

