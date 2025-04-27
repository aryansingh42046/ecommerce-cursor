import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
} from '@mui/material';
import { addToCart } from '../store/slices/cartSlice';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Product not found');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart', {
        productId: product._id,
        quantity: quantity,
      });
      dispatch(addToCart({ product, quantity }));
      // Show success message or notification
    } catch (error) {
      setError('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                inputProps={{ min: 1 }}
                sx={{ width: 100, mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Product Details
              </Typography>
              <Typography variant="body2">
                Category: {product.category}
              </Typography>
              <Typography variant="body2">
                Stock: {product.stock} available
              </Typography>
              <Typography variant="body2">
                Rating: {product.rating} ({product.numReviews} reviews)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails; 