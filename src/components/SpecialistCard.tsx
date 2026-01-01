'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { Specialist } from '@/types/specialist.types';

interface SpecialistCardProps {
  specialist: Specialist;
  onClick?: () => void;
}

export default function SpecialistCard({ specialist, onClick }: SpecialistCardProps) {
  // Get the primary image from media array
  const primaryImage = specialist.media?.find((m) => m.display_order === 0) || specialist.media?.[0];
  
  // Construct image URL
  // Cloudinary URLs are full URLs (https://res.cloudinary.com/...)
  // Local URLs are relative paths (/uploads/...)
  let imageUrl = '/placeholder-image.jpg';
  if (primaryImage?.file_path) {
    if (primaryImage.file_path.startsWith('http://') || primaryImage.file_path.startsWith('https://')) {
      // Cloudinary or external URL
      imageUrl = primaryImage.file_path;
    } else if (primaryImage.file_path.startsWith('/uploads/')) {
      // Local development URL - prepend API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      imageUrl = `${apiUrl}${primaryImage.file_path}`;
    } else {
      // Fallback
      imageUrl = primaryImage.file_path;
    }
  } else if (primaryImage?.file_name) {
    // Fallback to file_name
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    imageUrl = `${apiUrl}/uploads/${primaryImage.file_name}`;
  }

  // Extract specialist name from title (assuming format: "Name - Company Secretary")
  const nameMatch = specialist.title.match(/^([^-]+)/);
  const specialistName = nameMatch ? nameMatch[1].trim() : specialist.title;

  return (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': onClick
          ? {
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transform: 'translateY(-4px)',
            }
          : {},
      }}
      onClick={onClick}
    >
      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 180, sm: 200 },
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
        }}
      >
        {imageUrl && imageUrl !== '/placeholder-image.jpg' ? (
          <img
            src={imageUrl}
            alt={specialist.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e0e0e0',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No Image
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="#222222"
          sx={{ mb: 0.5, fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
        >
          {specialistName} - Company Secretary
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {specialist.description || 'Register your Company with the best Company Secretary in KL'}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#222222"
          sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}
        >
          {specialist.final_price
            ? `RM ${specialist.final_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : specialist.base_price
            ? `RM ${specialist.base_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : 'RM 0.00'}
        </Typography>
      </CardContent>
    </Card>
  );
}

