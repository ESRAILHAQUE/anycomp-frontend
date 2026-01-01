'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialists, setFilters, setPage } from '@/store/slices/specialistsSlice';
import {
  Box,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import PublicLayout from '@/components/layout/PublicLayout';
import SpecialistCard from '@/components/SpecialistCard';
import Pagination from '@/components/Pagination';
import { toast } from 'react-toastify';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { specialists, loading, pagination, filters } = useAppSelector(
    (state) => state.specialists
  );
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Fetch only published specialists for public view
  useEffect(() => {
    dispatch(
      fetchSpecialists({
        page: pagination.page,
        limit: 12, // Show 12 items per page for grid
        status: 'published', // Only show published specialists
        search: filters.search,
      })
    ).catch((error: any) => {
      toast.error(error?.message || 'Failed to fetch specialists');
    });
  }, [dispatch, pagination.page, filters.search]);

  const handleSpecialistClick = (id: string) => {
    // Navigate to specialist detail page
    router.push(`/specialists/${id}`);
  };

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/"
          sx={{ fontSize: '0.875rem', color: '#666' }}
        >
          Specialists
        </Link>
        <Typography sx={{ fontSize: '0.875rem', color: '#222222', fontWeight: 500 }}>
          Register a New Company
        </Typography>
      </Breadcrumbs>

      {/* Title Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'flex-start' }, 
        mb: 3,
        gap: { xs: 2, md: 0 },
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            color="#222222"
            sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
          >
            Register a New Company
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}>
            Get Your Company Registered with a Trusted Specialists
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
            <InputLabel id="price-filter-label">Price</InputLabel>
            <Select
              labelId="price-filter-label"
              id="price-filter"
              value={priceFilter}
              label="Price"
              onChange={(e) => setPriceFilter(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
              }}
            >
              <MenuItem value="">All Prices</MenuItem>
              <MenuItem value="low">Low to High</MenuItem>
              <MenuItem value="high">High to Low</MenuItem>
              <MenuItem value="0-1000">RM 0 - RM 1,000</MenuItem>
              <MenuItem value="1000-2000">RM 1,000 - RM 2,000</MenuItem>
              <MenuItem value="2000+">RM 2,000+</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
              }}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name-asc">Name: A to Z</MenuItem>
              <MenuItem value="name-desc">Name: Z to A</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Specialists Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : specialists.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No specialists found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filters or check back later.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
            {specialists.map((specialist) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={specialist.id}>
                <SpecialistCard
                  specialist={specialist}
                  onClick={() => handleSpecialistClick(specialist.id)}
                />
              </Grid>
            ))}
          </Grid>
          {pagination.totalPages > 1 && <Pagination />}
        </>
      )}
    </PublicLayout>
  );
}
