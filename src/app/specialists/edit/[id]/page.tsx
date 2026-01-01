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
  Divider,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Avatar,
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
  Info as InfoIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialistById, updateSpecialist, togglePublishStatus } from '@/store/slices/specialistsSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ImageUpload from '@/components/forms/ImageUpload';
import MultiSelectDropdown from '@/components/forms/MultiSelectDropdown';
import PublishModal from '@/components/PublishModal';
import EditServiceDrawer from '@/components/EditServiceDrawer';
import { Edit as EditIcon } from '@mui/icons-material';

const specialistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(500, 'Description must be 500 words or less').optional(),
  base_price: z.string().min(1, 'Price is required'),
  platform_fee: z.string().optional().default('0'),
  currency: z.string().default('MYR'),
  duration_days: z.string().min(1, 'Duration is required'),
  service_category: z.string().optional(),
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

const serviceCategories = [
  'Incorporation of a new company',
  'Monthly Company Secretary subscription',
  'Opening of Bank Account',
  'Appointment of Secretary',
  'Appointment/Resignation of Director',
  'Change of Nature of Business',
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
    description: 'Get Secure Access to Statutory Company Records',
  },
  {
    value: 'priority-filing',
    label: 'Priority Filing',
    icon: <ScheduleIcon />,
    description: 'Documents are prioritised for submitted and swift processing - within 24 hours!',
  },
  {
    value: 'registered-office-address',
    label: 'Registered Office Address Use',
    icon: <HomeIcon />,
    description: 'Use of SSM-Compliant Registered Office Address with Optional Mail Forwarding',
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
    description: 'Always-On Chat Support for Compliance, Filing, and General Queries',
  },
];

const durationOptions = Array.from({ length: 14 }, (_, i) => ({
  value: (i + 1).toString(),
  label: i === 0 ? '1 Day' : `${i + 1} days`,
}));

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
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('');
  const [currency, setCurrency] = useState<string>('MYR');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

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
        description: currentSpecialist.description || '',
        base_price: currentSpecialist.base_price?.toString() || '0',
        platform_fee: currentSpecialist.platform_fee?.toString() || '0',
        currency: (currentSpecialist as any).currency || 'MYR',
        duration_days: currentSpecialist.duration_days.toString(),
        service_category: (currentSpecialist as any).service_category || '',
        company_types: [],
        service_offerings: [],
      });
      setCurrency((currentSpecialist as any).currency || 'MYR');
      setSelectedServiceCategory((currentSpecialist as any).service_category || '');
      
      // Load company types if stored
      if ((currentSpecialist as any).company_types) {
        try {
          const types = typeof (currentSpecialist as any).company_types === 'string' 
            ? JSON.parse((currentSpecialist as any).company_types) 
            : (currentSpecialist as any).company_types;
          setSelectedCompanyTypes(Array.isArray(types) ? types : []);
        } catch {
          setSelectedCompanyTypes([]);
        }
      }
      
      // Load existing images if any
      if (currentSpecialist.media && currentSpecialist.media.length > 0) {
        const sortedMedia = [...currentSpecialist.media].sort((a, b) => a.display_order - b.display_order);
        const imageUrls = sortedMedia.slice(0, 3).map((m) => {
          if (m.file_path?.startsWith('http')) {
            return m.file_path;
          } else if (m.file_path) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${apiUrl}${m.file_path}`;
          }
          return m.file_name;
        });
        setImages([...imageUrls, ...Array(3 - imageUrls.length).fill(null)].slice(0, 3));
      }
      
      // Load service offerings if any
      if (currentSpecialist.service_offerings && currentSpecialist.service_offerings.length > 0) {
        const offerings = currentSpecialist.service_offerings.map((so) => so.name || so.id);
        setSelectedOfferings(offerings);
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
        // Convert selectedOfferings (string[]) to ServiceOffering[] format
        const serviceOfferingsArray = selectedOfferings.map((offeringValue) => {
          const offering = serviceOfferings.find((o) => o.value === offeringValue);
          return {
            name: offering?.label || offeringValue,
            description: offering?.description || '',
          };
        });

        const payload: any = {
          title: data.title,
          description: data.description || '',
          base_price: parseFloat(data.base_price),
          platform_fee: parseFloat(data.platform_fee || '0'),
          duration_days: parseInt(data.duration_days),
          service_category: selectedServiceCategory || undefined,
          company_types: selectedCompanyTypes,
        };

        if (serviceOfferingsArray.length > 0) {
          payload.service_offerings = serviceOfferingsArray;
        }

        await dispatch(updateSpecialist({ id, data: payload })).unwrap();
        toast.success('Specialist updated successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update specialist');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handlePublishClick = () => {
    setPublishModalOpen(true);
  };

  const handlePublishConfirm = async () => {
    try {
      // First save any changes
      const formData = watch();
      if (formData.title && formData.duration_days) {
        // Convert selectedOfferings (string[]) to ServiceOffering[] format
        const serviceOfferingsArray = selectedOfferings.map((offeringValue) => {
          const offering = serviceOfferings.find((o) => o.value === offeringValue);
          return {
            name: offering?.label || offeringValue,
            description: offering?.description || '',
          };
        });

        const payload: any = {
          title: formData.title,
          description: formData.description || '',
          base_price: parseFloat(formData.base_price),
          platform_fee: parseFloat(formData.platform_fee || '0'),
          duration_days: parseInt(formData.duration_days),
          service_category: selectedServiceCategory || undefined,
          company_types: selectedCompanyTypes,
        };

        if (serviceOfferingsArray.length > 0) {
          payload.service_offerings = serviceOfferingsArray;
        }

        await dispatch(updateSpecialist({ id, data: payload })).unwrap();
      }

      // Then publish (set is_draft to false)
      await dispatch(togglePublishStatus({ id, is_draft: false })).unwrap();
      toast.success('Specialist published successfully!');
      setPublishModalOpen(false);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to publish specialist');
    }
  };

  const handleEditDrawerSubmit = async (data: any, offerings: string[]) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || '',
        duration_days: parseInt(data.duration_days),
        base_price: parseFloat(data.base_price),
      };
      await dispatch(updateSpecialist({ id, data: payload })).unwrap();
      toast.success('Specialist updated successfully!');
      setEditDrawerOpen(false);
      // Refresh the specialist data
      dispatch(fetchSpecialistById(id));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update specialist');
    }
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: { xs: 2, sm: 3 }, 
        maxWidth: 1400, 
        mx: 'auto', 
        p: { xs: 2, sm: 3 },
      }}>
        {/* Main Content Area - All Sections (Same as Create Page) */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header with Action Buttons */}
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
              {watch('title') || currentSpecialist.title || 'Register a new company | Private Limited - Sdn Bhd'}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
            }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleSubmit((data) => onSubmit(data))}
                disabled={isSubmitting}
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                variant="contained"
                onClick={handlePublishClick}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#1976d2',
                  textTransform: 'none',
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Image Upload Section - Same as Create Page */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#222222">
                  Service Image
                </Typography>
              </Box>

              {/* Image Upload Components */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 2,
              }}>
                {images.length === 0 ? (
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
                    onClick={() => {
                      const newImages = [...images];
                      newImages[0] = null;
                      setImages(newImages);
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#999', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
                    </Typography>
                  </Box>
                ) : (
                  images.map((image, index) => (
                    <ImageUpload
                      key={index}
                      label={`Image ${index + 1}`}
                      index={index}
                      value={image}
                      onChange={handleImageChange}
                      onDelete={handleImageDelete}
                      onSetPrimary={handleSetPrimary}
                      isPrimary={primaryImageIndex === index}
                    />
                  ))
                )}
              </Box>
            </Paper>

            {/* Description - Same as Create Page */}
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

            {/* Additional Offerings - Same as Create Page */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#222222">
                  Addition Offering:
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enhance your service by adding additional offerings
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }} size="small">
                <InputLabel>Add Service Offering</InputLabel>
                <Select
                  value=""
                  label="Add Service Offering"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && !selectedOfferings.includes(value)) {
                      setSelectedOfferings([...selectedOfferings, value]);
                    }
                  }}
                >
                  <MenuItem value="">Select an offering</MenuItem>
                  {serviceOfferings
                    .filter((o) => !selectedOfferings.includes(o.value))
                    .map((offering) => (
                      <MenuItem key={offering.value} value={offering.value}>
                        {offering.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              
              {selectedOfferings.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {selectedOfferings.map((offeringValue) => {
                    const offering = serviceOfferings.find((o) => o.value === offeringValue);
                    if (!offering) return null;
                    return (
                      <Box
                        key={offeringValue}
                        sx={{
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          backgroundColor: '#fafafa',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <Box sx={{ color: '#1976d2', mt: 0.5 }}>
                          {offering.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="bold" color="#222222" sx={{ mb: 0.5 }}>
                            {offering.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {offering.description}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedOfferings(selectedOfferings.filter((v) => v !== offeringValue))}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                  No offerings added yet.
                </Typography>
              )}
            </Paper>

            {/* Company Secretary Section - Same as Create Page */}
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

            {/* Professional Fee Section - Same as Create Page */}
            <Paper sx={{ p: 3, mb: 3 }}>
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
                {currency} {(
                  parseFloat(watch('base_price') || currentSpecialist.base_price?.toString() || '0') +
                  parseFloat(watch('platform_fee') || currentSpecialist.platform_fee?.toString() || '0')
                ).toLocaleString()}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
                    {currency} {(
                      parseFloat(watch('base_price') || currentSpecialist.base_price?.toString() || '0') +
                      parseFloat(currentSpecialist.platform_fee?.toString() || '0')
                    ).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Your returns
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#1976d2">
                    {currency} {parseFloat(watch('base_price') || currentSpecialist.base_price?.toString() || '0').toLocaleString()}
                  </Typography>
                </Box>
              </Box>

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
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Duration (Days) *</InputLabel>
                  <Controller
                    name="duration_days"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Duration (Days) *">
                        {durationOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
            </Paper>
          </form>
        </Box>

        {/* Right Sidebar - Professional Fee Card (Same as Create Page) */}
        <Box sx={{ 
          width: { xs: '100%', lg: 350 },
          order: { xs: -1, lg: 0 },
        }}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            position: { xs: 'static', lg: 'sticky' }, 
            top: 20 
          }}>
            {/* Professional Fee Summary Card */}
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
                  {currency} {(
                    parseFloat(watch('base_price') || currentSpecialist.base_price?.toString() || '0') +
                    parseFloat(currentSpecialist.platform_fee?.toString() || '0')
                  ).toLocaleString()}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Base price
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#222222">
                      {currency} {parseFloat(watch('base_price') || currentSpecialist.base_price?.toString() || '0').toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Service processing fee
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#222222">
                      {currency} {parseFloat(watch('platform_fee') || currentSpecialist.platform_fee?.toString() || '0').toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" color="#222222">
                      Total
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#222222">
                      {currency} {(
                        parseFloat(watch('base_price') || currentSpecialist.base_price?.toString() || '0') +
                        parseFloat(currentSpecialist.platform_fee?.toString() || '0')
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Your returns
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#1976d2">
                      {currency} {parseFloat(watch('base_price') || currentSpecialist.base_price?.toString() || '0').toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Box>

      {/* Edit Service Drawer */}
      <EditServiceDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onSubmit={handleEditDrawerSubmit}
        initialData={{
          title: currentSpecialist.title,
          description: currentSpecialist.description,
          duration_days: currentSpecialist.duration_days?.toString() || '1',
          base_price: currentSpecialist.base_price?.toString() || '0.00',
          service_offerings: selectedOfferings,
        }}
        loading={isSubmitting}
      />

      {/* Publish Modal */}
      <PublishModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handlePublishConfirm}
        loading={isSubmitting}
      />
    </DashboardLayout>
  );
}
