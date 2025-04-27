import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { setProducts, setLoading, setError } from '../store/slices/productSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { products, searchResults, loading } = useSelector((state) => state.products);
  const displayProducts = searchResults.length > 0 ? searchResults : products;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setLoading());
        const response = await axios.get('http://localhost:5000/api/products');
        dispatch(setProducts(response.data));
      } catch (error) {
        dispatch(setError(error.message));
      }
    };

    fetchProducts();
  }, [dispatch]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {displayProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${product.price}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to={`/product/${product._id}`}
                  variant="contained"
                  fullWidth
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 