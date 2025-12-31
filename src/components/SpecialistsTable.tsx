'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Specialist, SpecialistStatus } from '@/types/specialist.types';

interface SpecialistsTableProps {
  specialists: Specialist[];
}

export default function SpecialistsTable({ specialists }: SpecialistsTableProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/specialists/edit/${id}`);
  };

  const getStatusColor = (status: SpecialistStatus) => {
    return status === SpecialistStatus.PUBLISHED ? 'success' : 'default';
  };

  if (specialists.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No specialists found
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#222222' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222222' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222222' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222222' }}>Specialization</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222222' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222222' }}>Created</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222222' }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {specialists.map((specialist) => (
            <TableRow key={specialist.id} hover>
              <TableCell>{specialist.name}</TableCell>
              <TableCell>{specialist.email || '-'}</TableCell>
              <TableCell>{specialist.phone || '-'}</TableCell>
              <TableCell>{specialist.specialization || '-'}</TableCell>
              <TableCell>
                <Chip
                  label={specialist.status}
                  color={getStatusColor(specialist.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {new Date(specialist.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(specialist.id)}
                    sx={{ color: '#222222' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

