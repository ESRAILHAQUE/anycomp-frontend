'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export default function PublicHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { text: 'Register a company', href: '/register' },
    { text: 'Appoint a Company Secretary', href: '/appoint' },
    { text: 'Company Secretarial Services', href: '/services', hasDropdown: true },
    { text: 'How Anycomp Works', href: '/how-it-works' },
  ];

  return (
    <Box
      sx={{
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          component="a"
          href="/"
          sx={{
            fontWeight: 'bold',
            color: '#222222',
            textDecoration: 'none',
            fontFamily: 'Red Hat Display, sans-serif',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          ANYCOMP
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { md: 2, lg: 3 }, alignItems: 'center', flex: 1, ml: { md: 2, lg: 4 } }}>
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <Box
                  key={link.text}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { color: '#1976d2' },
                  }}
                  onClick={handleMenuOpen}
                >
                  <Link
                    href={link.href}
                    sx={{
                      color: '#222222',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      '&:hover': { color: '#1976d2' },
                    }}
                  >
                    {link.text}
                  </Link>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </Box>
              ) : (
                <Link
                  key={link.text}
                  href={link.href}
                  sx={{
                    color: '#222222',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    '&:hover': { color: '#1976d2' },
                  }}
                >
                  {link.text}
                </Link>
              )
            ))}
          </Box>
        )}

        {/* Search Bar - Hidden on mobile, shown on tablet+ */}
        {!isMobile && (
          <TextField
            placeholder="Search for any services..."
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" edge="end">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { md: 250, lg: 300 },
              maxWidth: { md: 250, lg: 300 },
              display: { xs: 'none', md: 'block' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          />
        )}

        {/* Icons - Responsive */}
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'center' }}>
          {!isMobile && (
            <>
              <IconButton size="small" sx={{ color: '#222222' }}>
                <EmailIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#222222' }}>
                <NotificationsIcon />
              </IconButton>
            </>
          )}
          <IconButton size="small" sx={{ color: '#222222' }}>
            <AccountCircleIcon />
          </IconButton>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: '#222222', ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '80%', sm: 300 },
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#222222">
            Menu
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Mobile Search */}
        <TextField
          fullWidth
          placeholder="Search for any services..."
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" edge="end">
                  <SearchIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <List>
          {navLinks.map((link) => (
            <ListItem key={link.text} disablePadding>
              <ListItemButton
                component="a"
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
              >
                <ListItemText
                  primary={link.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
                {link.hasDropdown && (
                  <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleMenuClose}>Service 1</MenuItem>
        <MenuItem onClick={handleMenuClose}>Service 2</MenuItem>
        <MenuItem onClick={handleMenuClose}>Service 3</MenuItem>
      </Menu>
    </Box>
  );
}

