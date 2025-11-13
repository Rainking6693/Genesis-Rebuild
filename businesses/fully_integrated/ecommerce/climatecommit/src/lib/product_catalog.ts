import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

async function fetchProduct(productId: number): Promise<Product | null> {
  try {
    const response = await axios.get(`/api/products/${productId}`);
    const productData = response.data as Product;

    // Edge case: Check if the product data is valid
    if (!productData || !productData.id || !productData.name || !productData.price) {
      return null;
    }

    // Accessibility: Add alt text for the product image
    productData.imageAltText = `Product ${productData.name}`;

    return productData;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

// Usage example
fetchProduct(123)
  .then((product) => {
    if (product) {
      // Use the product object
      console.log(product);
    } else {
      // Handle the error case
      console.log('Error fetching the product');
    }
  })
  .catch((error) => {
    // Handle any other errors
    console.error(error);
  });

import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

async function fetchProduct(productId: number): Promise<Product | null> {
  try {
    const response = await axios.get(`/api/products/${productId}`);
    const productData = response.data as Product;

    // Edge case: Check if the product data is valid
    if (!productData || !productData.id || !productData.name || !productData.price) {
      return null;
    }

    // Accessibility: Add alt text for the product image
    productData.imageAltText = `Product ${productData.name}`;

    return productData;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

// Usage example
fetchProduct(123)
  .then((product) => {
    if (product) {
      // Use the product object
      console.log(product);
    } else {
      // Handle the error case
      console.log('Error fetching the product');
    }
  })
  .catch((error) => {
    // Handle any other errors
    console.error(error);
  });