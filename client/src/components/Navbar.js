import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  InputBase,
  Box,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { searchProducts } from '../store/slices/productSlice';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery));
      navigate('/');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          E-Commerce Store
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <form onSubmit={handleSearch}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 1, px: 1 }}>
              <InputBase
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ ml: 1, flex: 1 }}
              />
              <IconButton type="submit" sx={{ p: 1 }}>
                <Search />
              </IconButton>
            </Box>
          </form>

          <IconButton
            component={Link}
            to="/cart"
            color="inherit"
            sx={{ ml: 2 }}
          >
            <Badge badgeContent={items.length} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton
                component={Link}
                to="/profile"
                color="inherit"
                sx={{ ml: 1 }}
              >
                <AccountCircle />
              </IconButton>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                sx={{ ml: 1 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                color="inherit"
                sx={{ ml: 1 }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 