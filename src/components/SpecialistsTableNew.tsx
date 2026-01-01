'use client';

import { useState } from 'react';
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
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Specialist, VerificationStatus } from '@/types/specialist.types';
import { useAppDispatch } from '@/store/hooks';
import { deleteSpecialist } from '@/store/slices/specialistsSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface SpecialistsTableProps {
  specialists: Specialist[];
  selectedItems: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
}

export default function SpecialistsTableNew({
  specialists,
  selectedItems,
  onSelectAll,
  onSelectItem,
}: SpecialistsTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEdit = (id: string) => {
    handleMenuClose();
    router.push(`/specialists/edit/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    handleMenuClose();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${name}? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#222222',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteSpecialist(id)).unwrap();
        toast.success('Specialist deleted successfully!');
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete specialist');
      }
    }
  };

  const getApprovalColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.APPROVED:
        return 'success';
      case VerificationStatus.UNDER_REVIEW:
        return 'info';
      case VerificationStatus.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getPublishColor = (is_draft: boolean) => {
    return !is_draft ? 'success' : 'error';
  };

  const allSelected = specialists.length > 0 && selectedItems.length === specialists.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < specialists.length;

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 2, 
        boxShadow: 'none', 
        border: '1px solid #e0e0e0',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#fafafa' }}>
            <TableCell padding="checkbox" sx={{ width: 50 }}>
              <Checkbox
                indeterminate={someSelected}
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                sx={{ color: '#222222', '&.Mui-checked': { color: '#222222' } }}
              />
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#222222', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              SERVICE
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#222222', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              PRICE
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#222222', fontSize: { xs: '0.75rem', sm: '0.875rem' }, display: { xs: 'none', md: 'table-cell' } }}>
              PURCHASES
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#222222', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              DURATION
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#222222', fontSize: { xs: '0.75rem', sm: '0.875rem' }, display: { xs: 'none', lg: 'table-cell' } }}>
              APPROVAL STATUS
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#222222', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              PUBLISH STATUS
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#222222', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              ACTION
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {specialists.map((specialist) => {
            const isSelected = selectedItems.includes(specialist.id);
            return (
              <TableRow
                key={specialist.id}
                hover
                sx={{
                  backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
                  '&:hover': { backgroundColor: '#fafafa' },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => onSelectItem(specialist.id, e.target.checked)}
                    sx={{ color: '#222222', '&.Mui-checked': { color: '#222222' } }}
                  />
                </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{specialist.title}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {specialist.final_price
                        ? `RM ${specialist.final_price.toLocaleString()}`
                        : specialist.base_price
                        ? `RM ${specialist.base_price.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, display: { xs: 'none', md: 'table-cell' } }}>
                      {Math.floor(Math.random() * 10000)}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {specialist.duration_days} Days
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                      <Chip
                        label={specialist.verification_status === VerificationStatus.APPROVED
                          ? 'Approved'
                          : specialist.verification_status === VerificationStatus.UNDER_REVIEW
                          ? 'Under-Review'
                          : specialist.verification_status === VerificationStatus.REJECTED
                          ? 'Rejected'
                          : 'Pending'}
                        color={getApprovalColor(specialist.verification_status) as any}
                        size="small"
                        sx={{ fontSize: '0.75rem', height: 24 }}
                      />
                    </TableCell>
                <TableCell>
                  <Chip
                    label={specialist.is_draft ? 'Not Published' : 'Published'}
                    color={getPublishColor(specialist.is_draft) as any}
                    size="small"
                    sx={{ fontSize: '0.75rem', height: 24 }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, specialist.id)}
                    sx={{ color: '#222222' }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedId === specialist.id}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={() => handleEdit(specialist.id)}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDelete(specialist.id, specialist.title)}
                      sx={{ color: '#d32f2f' }}
                    >
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

