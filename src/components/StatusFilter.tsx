'use client';

import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, setPage } from '@/store/slices/specialistsSlice';
import { SpecialistStatus } from '@/types/specialist.types';

export default function StatusFilter() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.specialists);

  const handleStatusChange = (status: SpecialistStatus | 'all') => {
    dispatch(setFilters({ status }));
    dispatch(setPage(1)); // Reset to first page on filter change
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={filters.status}
        label="Status"
        onChange={(e) => handleStatusChange(e.target.value as SpecialistStatus | 'all')}
        sx={{ backgroundColor: 'white' }}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value={SpecialistStatus.DRAFT}>Drafts</MenuItem>
        <MenuItem value={SpecialistStatus.PUBLISHED}>Published</MenuItem>
      </Select>
    </FormControl>
  );
}

