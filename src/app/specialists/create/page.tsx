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
  Card,
  CardContent,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
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
    watch,
  } = useForm<SpecialistFormData>({
    resolver: zodResolver(specialistSchema),
    defaultValues: {
      is_draft: true,
    },
  });

  const basePriceValue = watch('base_price');
  const platformFeeValue = watch('platform_fee');
  const basePrice = basePriceValue ? parseFloat(basePriceValue) : 0;
  const platformFee = platformFeeValue ? parseFloat(platformFeeValue) : 0;
  const total = basePrice + platformFee;
  const yourReturns = basePrice;

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
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create specialist');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <DashboardLayout>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: { xs: 2, sm: 3 }, 
        maxWidth: 1400, 
        mx: 'auto' 
      }}>
        {/* Main Content Area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold" 
              color="#222222"
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' } }}
            >
              Register a new company | Private Limited - Sdn Bhd
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Image Upload Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
                Service Image
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #e0e0e0',
                  borderRadius: '8px',
                  p: 6,
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: '#999', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
                </Typography>
              </Box>

              {/* Image Thumbnails */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: 3,
                flexWrap: 'wrap',
              }}>
                <Box
                  sx={{
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 150, sm: 120 },
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <AddIcon sx={{ color: '#999' }} />
                </Box>
                <Box
                  sx={{
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 150, sm: 120 },
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <AddIcon sx={{ color: '#999' }} />
                </Box>
              </Box>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Describe your service here"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                  },
                }}
              />
            </Paper>

            {/* Additional Offerings */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
                Additional Offerings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enhance your service by adding additional offerings
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                Add Offering
              </Button>
            </Paper>

            {/* Company Secretary Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#222222" sx={{ mb: 3 }}>
                Company Secretary
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                alignItems: { xs: 'center', md: 'flex-start' },
              }}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Avatar
                    sx={{
                      width: { xs: 60, sm: 80 },
                      height: { xs: 60, sm: 80 },
                      bgcolor: '#1976d2',
                      mb: 1,
                      mx: { xs: 'auto', md: 0 },
                    }}
                  >
                    GL
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold" color="#222222">
                    Grace Lam
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Company Secretary, Sdn Bhd
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      borderColor: '#1976d2',
                      color: '#1976d2',
                    }}
                  >
                    View Profile
                  </Button>
                </Box>
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    A company secretarial service is essential for maintaining compliance with corporate governance requirements. Our experienced company secretary ensures all statutory obligations are met.
                  </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="caption" fontWeight="bold" color="#222222" sx={{ mb: 1, display: 'block' }}>
                    Certified Company Secretary
                  </Typography>
                  <Box
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 50, sm: 60 },
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      backgroundColor: '#fafafa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: { xs: 'auto', md: 0 },
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Micsa
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Hidden fields for form submission */}
            <input type="hidden" {...register('title')} />
            <input type="hidden" {...register('base_price')} />
            <input type="hidden" {...register('duration_days')} />
          </form>
        </Box>

        {/* Right Sidebar - Pricing Panel */}
        <Box sx={{ 
          width: { xs: '100%', lg: 350 },
          order: { xs: -1, lg: 0 },
        }}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            position: { xs: 'static', lg: 'sticky' }, 
            top: 20 
          }}>
            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1, 
              mb: 3 
            }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                fullWidth
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#1976d2',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </Box>

            {/* Professional Fee Card */}
            <Card sx={{ backgroundColor: '#fff', border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" color="#222222" sx={{ mb: 1 }}>
                  Professional Fee
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                  Set a rate for your service
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="#222222"
                  sx={{
                    mb: 3,
                    borderBottom: '2px solid #222222',
                    pb: 1,
                  }}
                >
                  RM {total.toLocaleString()}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Base price
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      placeholder="0"
                      {...register('base_price')}
                      error={!!errors.base_price}
                      sx={{
                        width: { xs: 100, sm: 120 },
                        '& .MuiOutlinedInput-root': {
                          height: 32,
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Service processing fee
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      placeholder="0"
                      {...register('platform_fee')}
                      error={!!errors.platform_fee}
                      sx={{
                        width: { xs: 100, sm: 120 },
                        '& .MuiOutlinedInput-root': {
                          height: 32,
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" color="#222222">
                      Total
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#222222">
                      RM {total.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Your returns
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#1976d2">
                      RM {yourReturns.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Title and Duration */}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Service Title *"
                    placeholder="Register a new company | Private Limited - Sdn Bhd"
                    {...register('title')}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Duration (Days) *"
                    type="number"
                    placeholder="7"
                    {...register('duration_days')}
                    error={!!errors.duration_days}
                    helperText={errors.duration_days?.message}
                  />
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
