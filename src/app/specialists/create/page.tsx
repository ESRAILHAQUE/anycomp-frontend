'use client';

import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { createSpecialist } from '@/store/slices/specialistsSlice';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/layout/DashboardLayout';

const specialistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  base_price: z.string().min(1, 'Base price is required').refine((val) => !isNaN(parseFloat(val)), 'Must be a valid number'),
  platform_fee: z.string().optional().refine((val) => !val || !isNaN(parseFloat(val)), 'Must be a valid number'),
  duration_days: z.string().min(1, 'Duration is required').refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, 'Must be a positive integer'),
  is_draft: z.boolean().default(true),
});

type SpecialistFormData = z.infer<typeof specialistSchema>;

export default function CreateSpecialistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SpecialistFormData>({
    resolver: zodResolver(specialistSchema),
    defaultValues: {
      is_draft: true,
    },
  });

  const onSubmit = async (data: SpecialistFormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || '',
        base_price: parseFloat(data.base_price),
        platform_fee: data.platform_fee ? parseFloat(data.platform_fee) : 0,
        duration_days: parseInt(data.duration_days),
        is_draft: data.is_draft,
      };
      await dispatch(createSpecialist(payload)).unwrap();
      toast.success('Specialist created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create specialist');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="#222222" sx={{ mb: 4 }}>
          Create Specialist
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
                  {isSubmitting ? 'Creating...' : 'Create Specialist'}
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
