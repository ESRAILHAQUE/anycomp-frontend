'use client';

import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { createSpecialist } from '@/store/slices/specialistsSlice';
import { SpecialistStatus } from '@/types/specialist.types';

const specialistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  bio: z.string().optional(),
  specialization: z.string().optional(),
  status: z.nativeEnum(SpecialistStatus).default(SpecialistStatus.DRAFT),
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
      status: SpecialistStatus.DRAFT,
    },
  });

  const onSubmit = async (data: SpecialistFormData) => {
    try {
      await dispatch(createSpecialist(data)).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Error creating specialist:', error);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" color="#222222" sx={{ mb: 4 }}>
        Create Specialist
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
    </Container>
  );
}

