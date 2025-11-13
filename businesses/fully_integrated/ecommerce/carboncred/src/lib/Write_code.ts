import { CartItem, Product } from './interfaces';

// Interfaces
interface CartItem {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  price: number;
}

// Helper function to get product by id
const getProductById = (products: Product[], id: number): Product | undefined => {
  return products.find((product) => product.id === id);
};

// Function to calculate the total cost of items in a shopping cart
const calculateTotalCost = (cartItems: CartItem[], products: Product[]): number => {
  // Check if cartItems and products are provided
  if (!cartItems || !products.length) {
    throw new Error('Cart items and products are required');
  }

  // Initialize total cost
  let totalCost = 0;

  // Iterate through each cart item
  for (const cartItem of cartItems) {
    // Get the product by id
    const product = getProductById(products, cartItem.productId);

    // Check if the product exists
    if (!product) {
      console.warn(`Product with id ${cartItem.productId} not found`);
      continue;
    }

    // Calculate the cost for the current cart item
    const cost = product.price * cartItem.quantity;

    // Add the cost to the total
    totalCost += cost;
  }

  return totalCost;
};

// Example usage
const cartItems: CartItem[] = [
  { productId: 1, quantity: 3 },
  { productId: 2, quantity: 2 },
];

const products: Product[] = [
  { id: 1, price: 10 },
  { id: 2, price: 20 },
];

const totalCost = calculateTotalCost(cartItems, products);
console.log(`Total cost: ${totalCost}`);

import { CartItem, Product } from './interfaces';

// Interfaces
interface CartItem {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  price: number;
}

// Helper function to get product by id
const getProductById = (products: Product[], id: number): Product | undefined => {
  return products.find((product) => product.id === id);
};

// Function to calculate the total cost of items in a shopping cart
const calculateTotalCost = (cartItems: CartItem[], products: Product[]): number => {
  // Check if cartItems and products are provided
  if (!cartItems || !products.length) {
    throw new Error('Cart items and products are required');
  }

  // Initialize total cost
  let totalCost = 0;

  // Iterate through each cart item
  for (const cartItem of cartItems) {
    // Get the product by id
    const product = getProductById(products, cartItem.productId);

    // Check if the product exists
    if (!product) {
      console.warn(`Product with id ${cartItem.productId} not found`);
      continue;
    }

    // Calculate the cost for the current cart item
    const cost = product.price * cartItem.quantity;

    // Add the cost to the total
    totalCost += cost;
  }

  return totalCost;
};

// Example usage
const cartItems: CartItem[] = [
  { productId: 1, quantity: 3 },
  { productId: 2, quantity: 2 },
];

const products: Product[] = [
  { id: 1, price: 10 },
  { id: 2, price: 20 },
];

const totalCost = calculateTotalCost(cartItems, products);
console.log(`Total cost: ${totalCost}`);