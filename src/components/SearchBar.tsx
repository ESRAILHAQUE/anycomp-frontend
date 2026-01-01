'use client';

import { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, setPage } from '@/store/slices/specialistsSlice';

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.specialists);
  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchValue }));
      dispatch(setPage(1)); // Reset to first page on search
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);

  return (
    <TextField
      fullWidth
      placeholder="Search specialists..."
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
          fontSize: { xs: '0.875rem', sm: '1rem' },
        },
      }}
    />
  );
}

