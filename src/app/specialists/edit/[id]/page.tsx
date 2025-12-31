'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Home as HomeIcon,
  CalendarToday as CalendarTodayIcon,
  Assignment as AssignmentIcon,
  LocalShipping as LocalShippingIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialistById, updateSpecialist } from '@/store/slices/specialistsSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ImageUpload from '@/components/forms/ImageUpload';
import MultiSelectDropdown from '@/components/forms/MultiSelectDropdown';

const specialistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  duration_days: z.string().min(1, 'Duration is required'),
  company_types: z.array(z.string()).default([]),
  service_offerings: z.array(z.string()).default([]),
});

type SpecialistFormData = z.infer<typeof specialistSchema>;

const companyTypes = [
  {
    value: 'private-limited',
    label: 'Private Limited - Sdn. Bhd.',
    description: 'Most common choice for businesses in Malaysia. Offers limited liability, easy ownership, and is ideal for startups and SMEs.',
  },
  {
    value: 'public-limited',
    label: 'Public Limited - Bhd.',
    description: 'Suitable for large businesses planning to raise capital from the public or list on the stock exchange.',
  },
];

const serviceOfferings = [
  {
    value: 'company-secretary-subscription',
    label: 'Company Secretary Subscription',
    icon: <PersonIcon />,
    description: 'Enjoy 1-month free Company Secretary Subscription',
  },
  {
    value: 'bank-account-opening',
    label: 'Opening of a Bank Account',
    icon: <AccountBalanceWalletIcon />,
    description: 'Complimentary Corporate Bank Account Opening',
  },
  {
    value: 'company-records-access',
    label: 'Access Company Records and SSM Forms',
    icon: <DescriptionIcon />,
    description: '24/7 Secure Access to Business Company Records',
  },
  {
    value: 'priority-filing',
    label: 'Priority Filing',
    icon: <ScheduleIcon />,
    description: 'Documents are pre-audited for submission and sent for e-stamping within 24 hours',
  },
  {
    value: 'registered-office-address',
    label: 'Registered Office Address Use',
    icon: <HomeIcon />,
    description: 'Use of SSM Compliant Registered Office Address with Optional Mail Forwarding',
  },
  {
    value: 'compliance-calendar',
    label: 'Compliance Calendar Setup',
    icon: <CalendarTodayIcon />,
    description: 'Get automated reminders for all statutory deadlines',
  },
  {
    value: 'share-certificate',
    label: 'First Share Certificate Issued Free',
    icon: <AssignmentIcon />,
    description: "Receive your company's first official share certificate at no cost",
  },
  {
    value: 'ctc-delivery',
    label: 'CTC Delivery & Courier Handling',
    icon: <LocalShippingIcon />,
    description: 'Have your company documents and certified copies delivered securely to you',
  },
  {
    value: 'chat-support',
    label: 'Chat Support',
    icon: <ChatIcon />,
    description: 'Always On Chat Support for Compliance, Filing, and General Queries',
  },
];

export default function EditSpecialistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentSpecialist, loading, error } = useAppSelector(
    (state) => state.specialists
  );

  const [images, setImages] = useState<(File | string | null)[]>([null, null, null]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number | null>(null);
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>([]);
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<SpecialistFormData>({
    resolver: zodResolver(specialistSchema),
  });

  const durationDays = watch('duration_days') || '1';
  const totalDays = 14; // This could come from backend

  useEffect(() => {
    if (id) {
      dispatch(fetchSpecialistById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentSpecialist) {
      reset({
        title: currentSpecialist.title,
        duration_days: currentSpecialist.duration_days.toString(),
        company_types: [],
        service_offerings: [],
      });
      // Load existing images if any
      if (currentSpecialist.media && currentSpecialist.media.length > 0) {
        const imageUrls = currentSpecialist.media.map((m) => m.file_name);
        setImages([...imageUrls, ...Array(3 - imageUrls.length).fill(null)].slice(0, 3));
      }
    }
  }, [currentSpecialist, reset]);

  const handleImageChange = (file: File | null, index: number) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleImageDelete = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(null);
    }
  };

  const handleSetPrimary = (index: number) => {
    setPrimaryImageIndex(index);
  };

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
          duration_days: parseInt(data.duration_days),
          // Add other fields as needed
        };
        await dispatch(updateSpecialist({ id, data: payload })).unwrap();
        toast.success('Specialist updated successfully!');
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update specialist');
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
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </DashboardLayout>
    );
  }

  if (!currentSpecialist) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          <Alert severity="warning">Specialist not found</Alert>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* TITLE Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
              TITLE
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your service title"
              label="Title"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                },
              }}
            />
          </Paper>

          {/* Estimated Completion Time */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 1 }}>
              Estimated Completion Time ({totalDays} Total Days)
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Estimated Completion Time (Days)</InputLabel>
              <Controller
                name="duration_days"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Estimated Completion Time (Days)"
                    sx={{
                      backgroundColor: '#fff',
                    }}
                  >
                    {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                      <MenuItem key={day} value={day.toString()}>
                        {day} {day === 1 ? 'day' : 'days'}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Paper>

          {/* Supported Company Types */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
              Supported Company Types
            </Typography>
            <MultiSelectDropdown
              label="Supported Company types"
              placeholder="Select company types"
              options={companyTypes}
              selected={selectedCompanyTypes}
              onChange={setSelectedCompanyTypes}
              descriptions={{
                'private-limited': 'Most common choice for businesses in Malaysia. Offers limited liability, easy ownership, and is ideal for startups and SMEs.',
                'public-limited': 'Suitable for large businesses planning to raise capital from the public or list on the stock exchange.',
              }}
            />
          </Paper>

          {/* Additional Offerings */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
              Additional Offerings
            </Typography>
            <MultiSelectDropdown
              label="Service Offerings"
              placeholder="Select service offerings"
              options={serviceOfferings}
              selected={selectedOfferings}
              onChange={setSelectedOfferings}
            />
          </Paper>

          {/* Service Images */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
              {[0, 1, 2].map((index) => (
                <ImageUpload
                  key={index}
                  label={`Service Image (${index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'})`}
                  index={index}
                  value={images[index]}
                  onChange={handleImageChange}
                  onDelete={handleImageDelete}
                  onSetPrimary={handleSetPrimary}
                  isPrimary={primaryImageIndex === index}
                />
              ))}
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
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
        </form>
      </Box>
    </DashboardLayout>
  );
}
