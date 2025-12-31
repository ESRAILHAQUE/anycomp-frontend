'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Receipt as ReceiptIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  { text: 'Specialists', icon: ShieldIcon, path: '/' },
  { text: 'Clients', icon: PeopleIcon, path: '/clients' },
  { text: 'Service Orders', icon: DescriptionIcon, path: '/service-orders' },
  { text: 'eSignature', icon: EditIcon, path: '/esignature' },
  { text: 'Messages', icon: EmailIcon, path: '/messages' },
  { text: 'Invoices & Receipts', icon: ReceiptIcon, path: '/invoices' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      {/* Profile Section */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#222222',
            }}
          >
            GL
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" color="#222222">
              Gwen Lam
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ST Comp Holdings Sdn Bhd
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Dashboard Section */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Dashboard
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: '8px',
                    mx: 1,
                    backgroundColor: isActive ? '#222222' : 'transparent',
                    color: isActive ? '#fff' : '#222222',
                    '&:hover': {
                      backgroundColor: isActive ? '#333333' : '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? '#fff' : '#222222',
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Help & Settings */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                mx: 1,
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#222222' }}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText
                primary="Help"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                mx: 1,
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#222222' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

