'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialists } from '@/store/slices/specialistsSlice';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import SpecialistsTable from '@/components/SpecialistsTable';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import Pagination from '@/components/Pagination';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { specialists, loading, pagination, filters } = useAppSelector(
    (state) => state.specialists
  );

  useEffect(() => {
    dispatch(
      fetchSpecialists({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        search: filters.search,
      })
    );
  }, [dispatch, pagination.page, pagination.limit, filters.status, filters.search]);

  const handleCreateClick = () => {
    router.push('/specialists/create');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="#222222">
          All Specialists
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{
            backgroundColor: '#222222',
            '&:hover': { backgroundColor: '#333333' },
          }}
        >
          Create Specialist
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <SearchBar />
        </Box>
        <StatusFilter />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <SpecialistsTable specialists={specialists} />
          {pagination.totalPages > 1 && <Pagination />}
        </>
      )}
    </Container>
  );
}
