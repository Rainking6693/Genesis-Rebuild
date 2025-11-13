import { ShoppingCartItem, Currency } from './types';

function calculateTotalCost(items: ShoppingCartItem[], currency: Currency): number {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid shopping cart');
  }

  if (!['USD', 'EUR', 'GBP'].includes(currency)) {
    throw new Error('Invalid currency');
  }

  const totalCost = items.reduce(
    (accumulator, currentItem) => accumulator + (currentItem.price * currentItem.quantity),
    0
  );

  return totalCost;
}

interface ShoppingCartItem {
  id: string;
  price: number;
  quantity: number;
}

type Currency = 'USD' | 'EUR' | 'GBP';

import { ShoppingCartItem, Currency } from './types';

function calculateTotalCost(items: ShoppingCartItem[], currency: Currency): number {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid shopping cart');
  }

  if (!['USD', 'EUR', 'GBP'].includes(currency)) {
    throw new Error('Invalid currency');
  }

  const totalCost = items.reduce(
    (accumulator, currentItem) => accumulator + (currentItem.price * currentItem.quantity),
    0
  );

  return totalCost;
}

interface ShoppingCartItem {
  id: string;
  price: number;
  quantity: number;
}

type Currency = 'USD' | 'EUR' | 'GBP';