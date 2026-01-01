'use client';

import PublicLayout from '@/components/layout/PublicLayout';
import { Box, Typography } from '@mui/material';

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          color="#222222"
          sx={{ mb: 2, fontSize: { xs: '1.75rem', sm: '2.5rem' } }}
        >
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
          The How Anycomp Works page is under development and will be available soon.
        </Typography>
      </Box>
    </PublicLayout>
  );
}

