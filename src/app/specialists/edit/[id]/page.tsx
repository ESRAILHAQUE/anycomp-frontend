'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
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
import { SpecialistStatus } from '@/types/specialist.types';

const specialistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  bio: z.string().optional(),
  specialization: z.string().optional(),
  status: z.nativeEnum(SpecialistStatus),
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

  const status = watch('status');

  useEffect(() => {
    if (id) {
      dispatch(fetchSpecialistById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentSpecialist) {
      reset({
        name: currentSpecialist.name,
        email: currentSpecialist.email || '',
        phone: currentSpecialist.phone || '',
        bio: currentSpecialist.bio || '',
        specialization: currentSpecialist.specialization || '',
        status: currentSpecialist.status,
      });
    }
  }, [currentSpecialist, reset]);

  const onSubmit = async (data: SpecialistFormData) => {
    try {
      await dispatch(updateSpecialist({ id, data })).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Error updating specialist:', error);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const newStatus =
        status === SpecialistStatus.PUBLISHED
          ? SpecialistStatus.DRAFT
          : SpecialistStatus.PUBLISHED;
      await dispatch(togglePublishStatus({ id, status: newStatus })).unwrap();
      reset({ ...watch(), status: newStatus });
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentSpecialist) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Specialist not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" color="#222222" sx={{ mb: 4 }}>
        Edit Specialist
      </Typography>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialization"
                {...register('specialization')}
                error={!!errors.specialization}
                helperText={errors.specialization?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                {...register('bio')}
                error={!!errors.bio}
                helperText={errors.bio?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={status === SpecialistStatus.PUBLISHED}
                    onChange={handlePublishToggle}
                    color="primary"
                  />
                }
                label={
                  status === SpecialistStatus.PUBLISHED
                    ? 'Published'
                    : 'Draft'
                }
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
    </Container>
  );
}

