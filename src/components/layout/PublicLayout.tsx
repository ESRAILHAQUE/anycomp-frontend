'use client';

import { Box } from '@mui/material';
import PublicHeader from './PublicHeader';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <PublicHeader />
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3, md: 4 } }}>
        {children}
      </Box>
    </Box>
  );
}

