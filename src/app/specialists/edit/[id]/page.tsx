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
        const payload = {
          title: formData.title,
          duration_days: parseInt(formData.duration_days),
        };
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
        p: { xs: 2, sm: 3 } 
      }}>
        {/* Main Content Area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header with Edit and Publish buttons */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 3,
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
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
            }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditDrawerOpen(true)}
                fullWidth={false}
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
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={handlePublishClick}
                disabled={isSubmitting}
                fullWidth={false}
                sx={{
                  backgroundColor: '#1976d2',
                  textTransform: 'none',
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Publish
              </Button>
            </Box>
          </Box>

          {/* Image Upload Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                border: '2px dashed #e0e0e0',
                borderRadius: '8px',
                p: 6,
                textAlign: 'center',
                backgroundColor: '#fafafa',
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Upload an image for your service listing in PNG, JPG or JPEG - up to 10MB
              </Typography>
            </Box>
            {/* Image Thumbnails */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              flexWrap: 'wrap',
            }}>
              {[0, 1].map((index) => (
                <Box
                  key={index}
                  sx={{
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 150, sm: 120 },
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {images[index] ? (
                    <img
                      src={typeof images[index] === 'string' ? images[index] : URL.createObjectURL(images[index] as File)}
                      alt={`Service ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Image {index + 1}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Description Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentSpecialist.description || 'Describe your service here'}
            </Typography>
          </Paper>

          {/* Additional Offerings Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 2 }}>
              Additional Offerings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enhance your service by adding additional offerings
            </Typography>
          </Paper>

          {/* Company Secretary Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 3 }}>
              Company Secretary
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3, 
              alignItems: { xs: 'center', md: 'flex-start' },
            }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    mb: 1,
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  GL
                </Box>
                <Typography variant="body2" fontWeight="bold" color="#222222">
                  Grace Lam
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Company Secretary - Sdn Bhd
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
        </Box>

        {/* Right Sidebar - Professional Fee */}
        <Box sx={{ 
          width: { xs: '100%', lg: 350 },
          order: { xs: -1, lg: 0 },
        }}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            position: { xs: 'static', lg: 'sticky' }, 
            top: 20 
          }}>
            <Typography variant="h6" fontWeight="bold" color="#222222" sx={{ mb: 1 }}>
              Professional Fee
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Set a rate for your service
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#222222"
              sx={{ mb: 3, textDecoration: 'underline' }}
            >
              RM {currentSpecialist.base_price || '0.00'}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Base price:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  RM {currentSpecialist.base_price || '0.00'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Service processing fee:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  RM {currentSpecialist.platform_fee || '0.00'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  RM {currentSpecialist.final_price || '0.00'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Your returns:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  RM {currentSpecialist.base_price || '0.00'}
                </Typography>
              </Box>
            </Box>
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
