'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialists, setFilters, setPage } from '@/store/slices/specialistsSlice';
import { Box, Typography, Button, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import SpecialistsTableNew from '@/components/SpecialistsTableNew';
import TabsFilter from '@/components/TabsFilter';
import Pagination from '@/components/Pagination';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'react-toastify';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { specialists, loading, pagination, filters } = useAppSelector(
    (state) => state.specialists
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    dispatch(
      fetchSpecialists({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        search: filters.search,
      })
    ).catch((error: any) => {
      toast.error(error?.message || 'Failed to fetch specialists');
    });
  }, [dispatch, pagination.page, pagination.limit, filters.status, filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchValue }));
      dispatch(setPage(1));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);

  const handleCreateClick = () => {
    router.push('/specialists/create');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(specialists.map((s) => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  return (
    <DashboardLayout>
      <Box>
        {/* Title Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="#222222"
            sx={{ mb: 0.5 }}
          >
            Specialists
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and publish your services for Client's & Companies
          </Typography>
        </Box>

        {/* Tabs */}
        <TabsFilter />

        {/* Search and Actions */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <TextField
            placeholder="Search Services"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                borderRadius: '8px',
              },
            }}
            size="small"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{
              backgroundColor: '#1976d2',
              color: '#fff',
              textTransform: 'none',
              px: 3,
              '&:hover': { backgroundColor: '#1565c0' },
            }}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: '#e3f2fd',
              },
            }}
          >
            Export
          </Button>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SpecialistsTableNew
              specialists={specialists}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
            />
            {pagination.totalPages > 1 && <Pagination />}
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}
