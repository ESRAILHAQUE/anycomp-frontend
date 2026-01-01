'use client';

import { Box, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPage, fetchSpecialists } from '@/store/slices/specialistsSlice';

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { pagination, filters } = useAppSelector((state) => state.specialists);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    dispatch(setPage(page));
    dispatch(
      fetchSpecialists({
        page,
        limit: pagination.limit,
        status: filters.status,
        search: filters.search,
      })
    );
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const total = pagination.totalPages;
    const current = pagination.page;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: { xs: 0.5, sm: 1 }, 
      mt: 4,
      flexWrap: 'wrap',
    }}>
      <Button
        variant="outlined"
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        sx={{
          textTransform: 'none',
          borderColor: '#e0e0e0',
          color: '#222222',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          px: { xs: 1.5, sm: 2 },
          '&:hover': { borderColor: '#222222', backgroundColor: '#f5f5f5' },
          '&:disabled': { borderColor: '#e0e0e0', color: '#ccc' },
        }}
      >
        &lt; Previous
      </Button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <Typography key={`ellipsis-${index}`} sx={{ px: { xs: 0.5, sm: 1 }, color: '#666', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              ...
            </Typography>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === pagination.page;

        return (
          <Button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            sx={{
              minWidth: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              borderRadius: '4px',
              textTransform: 'none',
              backgroundColor: isActive ? '#1976d2' : 'transparent',
              color: isActive ? '#fff' : '#222222',
              fontWeight: isActive ? 600 : 400,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              '&:hover': {
                backgroundColor: isActive ? '#1565c0' : '#f5f5f5',
              },
            }}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="outlined"
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
        sx={{
          textTransform: 'none',
          borderColor: '#e0e0e0',
          color: '#222222',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          px: { xs: 1.5, sm: 2 },
          '&:hover': { borderColor: '#222222', backgroundColor: '#f5f5f5' },
          '&:disabled': { borderColor: '#e0e0e0', color: '#ccc' },
        }}
      >
        Next &gt;
      </Button>
    </Box>
  );
}

