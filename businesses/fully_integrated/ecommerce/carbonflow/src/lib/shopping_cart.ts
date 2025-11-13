import { isNumber, isPositiveInteger } from 'class-validator';

type SubscriptionQuantity = number;

function validateSubscriptionQuantity(quantity: SubscriptionQuantity): SubscriptionQuantity {
  if (!isNumber(quantity) || !isPositiveInteger(quantity)) {
    throw new Error('Invalid subscription quantity. Please provide a positive integer.');
  }
  return quantity;
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

type ShoppingCartItem = {
  product: Product;
  quantity: SubscriptionQuantity;
};

type ShoppingCart = ShoppingCartItem[];

function addItemToCart(cart: ShoppingCart, product: Product, quantity: SubscriptionQuantity): ShoppingCart {
  validateSubscriptionQuantity(quantity);

  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for product ${product.name}.`);
  }

  const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  return cart;
}

function removeItemFromCart(cart: ShoppingCart, productId: string): ShoppingCart {
  const itemIndex = cart.findIndex((item) => item.product.id === productId);

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }

  return cart;
}

function updateItemQuantityInCart(cart: ShoppingCart, productId: string, newQuantity: SubscriptionQuantity): ShoppingCart {
  const itemIndex = cart.findIndex((item) => item.product.id === productId);

  if (itemIndex !== -1) {
    validateSubscriptionQuantity(newQuantity);

    if (newQuantity <= 0) {
      removeItemFromCart(cart, productId);
    } else {
      cart[itemIndex].quantity = newQuantity;
    }
  }

  return cart;
}

function getTotalPrice(cart: ShoppingCart): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

function isEmpty(cart: ShoppingCart): boolean {
  return cart.length === 0;
}

import { isNumber, isPositiveInteger } from 'class-validator';

type SubscriptionQuantity = number;

function validateSubscriptionQuantity(quantity: SubscriptionQuantity): SubscriptionQuantity {
  if (!isNumber(quantity) || !isPositiveInteger(quantity)) {
    throw new Error('Invalid subscription quantity. Please provide a positive integer.');
  }
  return quantity;
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

type ShoppingCartItem = {
  product: Product;
  quantity: SubscriptionQuantity;
};

type ShoppingCart = ShoppingCartItem[];

function addItemToCart(cart: ShoppingCart, product: Product, quantity: SubscriptionQuantity): ShoppingCart {
  validateSubscriptionQuantity(quantity);

  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for product ${product.name}.`);
  }

  const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  return cart;
}

function removeItemFromCart(cart: ShoppingCart, productId: string): ShoppingCart {
  const itemIndex = cart.findIndex((item) => item.product.id === productId);

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }

  return cart;
}

function updateItemQuantityInCart(cart: ShoppingCart, productId: string, newQuantity: SubscriptionQuantity): ShoppingCart {
  const itemIndex = cart.findIndex((item) => item.product.id === productId);

  if (itemIndex !== -1) {
    validateSubscriptionQuantity(newQuantity);

    if (newQuantity <= 0) {
      removeItemFromCart(cart, productId);
    } else {
      cart[itemIndex].quantity = newQuantity;
    }
  }

  return cart;
}

function getTotalPrice(cart: ShoppingCart): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

function isEmpty(cart: ShoppingCart): boolean {
  return cart.length === 0;
}