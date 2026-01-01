'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';

interface ImageUploadProps {
  label: string;
  index: number;
  value?: File | string | null;
  onChange: (file: File | null, index: number) => void;
  onDelete: (index: number) => void;
  onSetPrimary?: (index: number) => void;
  isPrimary?: boolean;
}

export default function ImageUpload({
  label,
  index,
  value,
  onChange,
  onDelete,
  onSetPrimary,
  isPrimary = false,
}: ImageUploadProps) {
  const getPreview = (val: File | string | null | undefined): string | null => {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return URL.createObjectURL(val);
  };

  const [preview, setPreview] = useState<string | null>(getPreview(value));

  // Update preview when value changes
  useEffect(() => {
    const newPreview = getPreview(value);
    setPreview(newPreview);
    
    // Cleanup object URL if it was created
    return () => {
      if (value && typeof value !== 'string' && newPreview && newPreview.startsWith('blob:')) {
        URL.revokeObjectURL(newPreview);
      }
    };
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file, index);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    onDelete(index);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" color="#222222" sx={{ mb: 1 }}>
        {label}
      </Typography>
      {preview ? (
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box
            component="img"
            src={preview}
            alt={label}
            sx={{
              width: { xs: '100%', sm: 80 },
              height: { xs: 120, sm: 60 },
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
          <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" fontWeight="bold" color="#222222" sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
              {typeof value === 'object' && value ? value.name : 'image.png'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}>
              {typeof value === 'object' && value
                ? `${(value.size / 1024 / 1024).toFixed(1)} MB`
                : '1.2 MB'}{' '}
              • PNG
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 0.5 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            {onSetPrimary && (
              <IconButton
                size="small"
                onClick={() => onSetPrimary(index)}
                sx={{ color: isPrimary ? '#ffc107' : '#999' }}
              >
                {isPrimary ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            )}
            <IconButton size="small" onClick={handleDelete} sx={{ color: '#d32f2f' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <Box
          sx={{
            border: '2px dashed #e0e0e0',
            borderRadius: '8px',
            p: { xs: 2, sm: 4 },
            textAlign: 'center',
            backgroundColor: '#fafafa',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id={`image-upload-${index}`}
          />
          <label htmlFor={`image-upload-${index}`} style={{ cursor: 'pointer' }}>
            <CloudUploadIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: '#999', mb: 2, display: 'block', mx: 'auto' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
              Drag & drop to upload
            </Typography>
            <Button
              variant="outlined"
              component="span"
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                textTransform: 'none',
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              Browse
            </Button>
          </label>
        </Box>
      )}
    </Box>
  );
}

