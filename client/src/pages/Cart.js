import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setCart,
} from '../store/slices/cartSlice';
import axios from 'axios';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchCart = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/cart');
          dispatch(setCart(response.data));
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };
      fetchCart();
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`http://localhost:5000/api/cart/${productId}`, {
        quantity: newQuantity,
      });
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      dispatch(removeFromCart(productId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (items.length === 0) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.product._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: 50, height: 50, marginRight: 10 }}
                    />
                    <Typography>{item.product.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">${item.product.price}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.product._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Total: ${total.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/checkout"
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Container>
  );
};

export default Cart; 