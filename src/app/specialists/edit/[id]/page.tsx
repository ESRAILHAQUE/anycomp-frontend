'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialistById, updateSpecialist, togglePublishStatus } from '@/store/slices/specialistsSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import DashboardLayout from '@/components/layout/DashboardLayout';

const specialistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  base_price: z.string().min(1, 'Base price is required').refine((val) => !isNaN(parseFloat(val)), 'Must be a valid number'),
  platform_fee: z.string().optional().refine((val) => !val || !isNaN(parseFloat(val)), 'Must be a valid number'),
  duration_days: z.string().min(1, 'Duration is required').refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, 'Must be a positive integer'),
  is_draft: z.boolean(),
});

type SpecialistFormData = z.infer<typeof specialistSchema>;

export default function EditSpecialistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentSpecialist, loading, error } = useAppSelector(
    (state) => state.specialists
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<SpecialistFormData>({
    resolver: zodResolver(specialistSchema),
  });

  const is_draft = watch('is_draft');

  useEffect(() => {
    if (id) {
      dispatch(fetchSpecialistById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentSpecialist) {
      reset({
        title: currentSpecialist.title,
        description: currentSpecialist.description || '',
        base_price: currentSpecialist.base_price.toString(),
        platform_fee: currentSpecialist.platform_fee?.toString() || '0',
        duration_days: currentSpecialist.duration_days.toString(),
        is_draft: currentSpecialist.is_draft,
      });
    }
  }, [currentSpecialist, reset]);

  const onSubmit = async (data: SpecialistFormData) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this specialist?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#222222',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const payload = {
          title: data.title,
          description: data.description || '',
          base_price: parseFloat(data.base_price),
          platform_fee: data.platform_fee ? parseFloat(data.platform_fee) : 0,
          duration_days: parseInt(data.duration_days),
          is_draft: data.is_draft,
        };
        await dispatch(updateSpecialist({ id, data: payload })).unwrap();
        toast.success('Specialist updated successfully!');
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update specialist');
    }
  };

  const handlePublishToggle = async () => {
    try {
      const newIsDraft = !is_draft;
      const action = newIsDraft ? 'unpublish' : 'publish';
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `Do you want to ${action} this specialist?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#222222',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${action} it!`,
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await dispatch(togglePublishStatus({ id, is_draft: newIsDraft })).unwrap();
        reset({ ...watch(), is_draft: newIsDraft });
        toast.success(`Specialist ${action}ed successfully!`);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update status');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </DashboardLayout>
    );
  }

  if (!currentSpecialist) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Alert severity="warning">Specialist not found</Alert>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" fontWeight="bold" color="#222222" sx={{ mb: 4 }}>
        Edit Specialist
      </Typography>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title *"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Base Price (RM) *"
                type="number"
                {...register('base_price')}
                error={!!errors.base_price}
                helperText={errors.base_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Platform Fee (RM)"
                type="number"
                {...register('platform_fee')}
                error={!!errors.platform_fee}
                helperText={errors.platform_fee?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (Days) *"
                type="number"
                {...register('duration_days')}
                error={!!errors.duration_days}
                helperText={errors.duration_days?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!is_draft}
                    onChange={handlePublishToggle}
                    color="primary"
                  />
                }
                label={is_draft ? 'Draft' : 'Published'}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: '#222222',
                    '&:hover': { backgroundColor: '#333333' },
                  }}
                >
                  {isSubmitting ? 'Updating...' : 'Update Specialist'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
    </DashboardLayout>
  );
}
