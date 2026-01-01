'use client';

import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minWidth: 0, // Prevent overflow
        }}
      >
        <Header onDrawerToggle={handleDrawerToggle} />
        <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 }, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}

