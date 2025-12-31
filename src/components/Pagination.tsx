'use client';

import { Box, Pagination as MuiPagination } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPage, fetchSpecialists } from '@/store/slices/specialistsSlice';

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { pagination, filters } = useAppSelector((state) => state.specialists);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
    dispatch(
      fetchSpecialists({
        page: value,
        limit: pagination.limit,
        status: filters.status,
        search: filters.search,
      })
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <MuiPagination
        count={pagination.totalPages}
        page={pagination.page}
        onChange={handlePageChange}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#222222',
          },
          '& .Mui-selected': {
            backgroundColor: '#222222',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
        }}
      />
    </Box>
  );
}

