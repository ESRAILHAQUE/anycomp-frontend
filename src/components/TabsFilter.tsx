'use client';

import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters } from '@/store/slices/specialistsSlice';

export default function TabsFilter() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.specialists);

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Drafts', value: 'draft' },
    { label: 'Published', value: 'published' },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: { xs: 0.5, sm: 1 }, 
      mb: 3, 
      borderBottom: '2px solid #e0e0e0',
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      scrollbarWidth: 'none',
    }}>
      {tabs.map((tab) => {
        const isActive =
          (tab.value === 'all' && filters.status === 'all') ||
          (tab.value !== 'all' && filters.status === tab.value);

        return (
          <Button
            key={tab.value}
            onClick={() => dispatch(setFilters({ status: tab.value as any }))}
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 0,
              color: isActive ? '#222222' : '#666',
              fontWeight: isActive ? 600 : 400,
              borderBottom: isActive ? '2px solid #222222' : '2px solid transparent',
              mb: '-2px',
              textTransform: 'none',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#222222',
              },
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Box>
  );
}

