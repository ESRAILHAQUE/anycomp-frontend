'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  descriptions?: Record<string, string>;
}

export default function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selected,
  onChange,
  descriptions = {},
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" color="#222222" sx={{ mb: 1, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
        {label}
      </Typography>
      <Box sx={{ position: 'relative' }} ref={dropdownRef}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value=""
          onClick={() => setOpen(!open)}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton size="small" onClick={() => setOpen(!open)}>
                <KeyboardArrowDownIcon
                  sx={{
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </IconButton>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              cursor: 'pointer',
            },
          }}
        />
        {selected.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <Chip
                  key={value}
                  label={option?.label || value}
                  onDelete={() => handleRemove(value)}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    '& .MuiChip-deleteIcon': {
                      color: '#1976d2',
                    },
                  }}
                />
              );
            })}
          </Box>
        )}
        {selected.length > 0 && descriptions && (
          <Box sx={{ mt: 2 }}>
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value);
              const description = descriptions[value];
              if (!description) return null;
              return (
                <Box key={value} sx={{ mb: 1.5 }}>
                  <Typography variant="body2" fontWeight="bold" color="#222222" sx={{ mb: 0.5 }}>
                    {option?.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
        {open && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: { xs: 300, sm: 400 },
              overflow: 'auto',
              zIndex: 1000,
              boxShadow: 3,
            }}
          >
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <Box
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                    '&:hover': {
                      backgroundColor: isSelected ? '#bbdefb' : '#f5f5f5',
                    },
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {option.icon && <Box sx={{ color: '#1976d2' }}>{option.icon}</Box>}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                        {option.label}
                      </Typography>
                      {option.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {option.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        )}
      </Box>
    </Box>
  );
}

