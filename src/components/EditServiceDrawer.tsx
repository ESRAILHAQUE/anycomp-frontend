'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const editServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  duration_days: z.string().min(1, 'Duration is required'),
  base_price: z.string().min(1, 'Price is required'),
});

type EditServiceFormData = z.infer<typeof editServiceSchema>;

interface EditServiceDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EditServiceFormData, offerings: string[]) => void;
  initialData?: {
    title?: string;
    description?: string;
    duration_days?: string;
    base_price?: string;
    service_offerings?: string[];
  };
  loading?: boolean;
}

const serviceOfferingsOptions = [
  'Company Secretary Subscription',
  'LPC Charges',
  'eSignature',
  'Opening of a Bank Account',
  'Access Company Records and SSM Forms',
  'Priority Filing',
  'Registered Office Address Use',
  'Compliance Calendar Setup',
  'First Share Certificate Issued Free',
  'CTC Delivery & Courier Handling',
  'Chat Support',
];

export default function EditServiceDrawer({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: EditServiceDrawerProps) {
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>(
    initialData?.service_offerings || []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditServiceFormData>({
    resolver: zodResolver(editServiceSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      duration_days: initialData?.duration_days || '1',
      base_price: initialData?.base_price || '0.00',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        duration_days: initialData.duration_days || '1',
        base_price: initialData.base_price || '0.00',
      });
      setSelectedOfferings(initialData.service_offerings || []);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: EditServiceFormData) => {
    onSubmit(data, selectedOfferings);
  };

  const handleAddOffering = (offering: string) => {
    if (!selectedOfferings.includes(offering)) {
      setSelectedOfferings([...selectedOfferings, offering]);
    }
  };

  const handleRemoveOffering = (offering: string) => {
    setSelectedOfferings(selectedOfferings.filter((o) => o !== offering));
  };

  const availableOfferings = serviceOfferingsOptions.filter(
    (o) => !selectedOfferings.includes(o)
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="#222222">
          Edit Service
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" color="#666" sx={{ mb: 1 }}>
            Title
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter service title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
              },
            }}
          />
        </Box>

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" color="#666" sx={{ mb: 1 }}>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
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
        </Box>

        {/* Estimated Completion Time */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" color="#666" sx={{ mb: 1 }}>
            Estimated Completion Time (Days)
          </Typography>
          <FormControl fullWidth>
            <Controller
              name="duration_days"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  placeholder="1"
                  error={!!errors.duration_days}
                  helperText={errors.duration_days?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Box>

        {/* Price */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" color="#666" sx={{ mb: 1 }}>
            Price
          </Typography>
          <TextField
            fullWidth
            placeholder="0.00"
            {...register('base_price')}
            error={!!errors.base_price}
            helperText={errors.base_price?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start">RM</InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
              },
            }}
          />
        </Box>

        {/* Additional Offerings */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" color="#666" sx={{ mb: 1 }}>
            Additional Offerings
          </Typography>
          
          {/* Selected Offerings as Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedOfferings.map((offering) => (
              <Chip
                key={offering}
                label={offering}
                onDelete={() => handleRemoveOffering(offering)}
                sx={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  '& .MuiChip-deleteIcon': {
                    color: '#1976d2',
                  },
                }}
              />
            ))}
          </Box>

          {/* Add Offering Dropdown */}
          {availableOfferings.length > 0 && (
            <FormControl fullWidth>
              <Select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddOffering(e.target.value);
                  }
                }}
                displayEmpty
                sx={{
                  backgroundColor: '#fff',
                }}
              >
                <MenuItem value="" disabled>
                  Select an offering to add
                </MenuItem>
                {availableOfferings.map((offering) => (
                  <MenuItem key={offering} value={offering}>
                    {offering}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            fullWidth
            sx={{
              borderColor: '#ddd',
              color: '#666',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#bbb',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              backgroundColor: '#1976d2',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {loading ? 'Updating...' : 'Confirm'}
          </Button>
        </Box>
      </form>
    </Drawer>
  );
}

