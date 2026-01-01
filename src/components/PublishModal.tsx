'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function PublishModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: PublishModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          m: { xs: 2, sm: 3 },
          maxWidth: { xs: 'calc(100% - 32px)', sm: '500px' },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', color: '#222222', pb: 1, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
        Publish changes
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <DialogContentText sx={{ color: '#666', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
          Are you sure you want to publish these changes? It will appear in the marketplace listing.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 1, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          fullWidth={false}
          sx={{
            color: '#666',
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          fullWidth={false}
          sx={{
            backgroundColor: '#1976d2',
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          {loading ? 'Publishing...' : 'Publish Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

