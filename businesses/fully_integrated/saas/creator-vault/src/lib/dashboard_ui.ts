import { findIndex } from 'lodash';

interface Product {
  id: number;
  name: string;
  price: number;
  theme: string[];
}

interface Subscriber {
  id: number;
  creatorId: number;
  themePreferences: string[];
}

interface Creator {
  id: number;
  name: string;
  contentThemes: string[];
}

interface Supplier {
  id: number;
  name: string;
  products: Product[];
}

interface CreatorVault {
  creators: Creator[];
  subscribers: Subscriber[];
  suppliers: Supplier[];
}

function validateData(data: CreatorVault, subscriberId?: number): asserts data {
  if (!data || !data.creators.length || !data.subscribers.length || !data.suppliers.length) {
    throw new Error('Invalid data');
  }

  data.creators.forEach((creator) => validateCreator(creator));
  data.subscribers.forEach((subscriber) => validateSubscriber(subscriber));
  data.suppliers.forEach((supplier) => validateSupplier(supplier));

  if (subscriberId) {
    const subscriber = data.subscribers.find((s) => s.id === subscriberId);

    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    validateSubscriber(subscriber);
  }
}

function validateCreator(creator: Creator): asserts creator {
  if (!creator || !creator.id || !creator.name || !creator.contentThemes.length) {
    throw new Error('Invalid creator');
  }
}

function validateSupplier(supplier: Supplier): asserts supplier {
  if (!supplier || !supplier.id || !supplier.name || !supplier.products.length) {
    throw new Error('Invalid supplier');
  }

  supplier.products.forEach((product) => validateProduct(product));
}

function validateProduct(product: Product): asserts product {
  if (!product || !product.id || !product.name || !product.price || !product.theme.length) {
    throw new Error('Invalid product');
  }
}

function getCreatorIndex(creators: Creator[], creatorId: number): number {
  const index = findIndex(creators, { id: creatorId });

  if (index === -1) {
    throw new Error('Creator not found');
  }

  return index;
}

function getMatchingProducts(creatorVault: CreatorVault, subscriber: Subscriber): Product[] {
  return creatorVault.suppliers.flatMap((supplier) =>
    supplier.products.filter((product) =>
      product.theme.some((theme) => subscriber.themePreferences.includes(theme)) &&
      subscriber.creatorId === getCreatorIndex(creatorVault.creators, subscriber.creatorId)
    )
  );
}

function calculateTotalBoxValue(creatorVault: CreatorVault, subscriberId?: number): number {
  validateData(creatorVault, subscriberId);

  const subscriber = subscriberId ? creatorVault.subscribers.find((s) => s.id === subscriberId) : creatorVault.subscribers[0];

  let totalValue = 0;
  const matchingProducts = getMatchingProducts(creatorVault, subscriber);

  totalValue = matchingProducts.reduce((acc, product) => acc + product.price, 0);

  return totalValue;
}

import { findIndex } from 'lodash';

interface Product {
  id: number;
  name: string;
  price: number;
  theme: string[];
}

interface Subscriber {
  id: number;
  creatorId: number;
  themePreferences: string[];
}

interface Creator {
  id: number;
  name: string;
  contentThemes: string[];
}

interface Supplier {
  id: number;
  name: string;
  products: Product[];
}

interface CreatorVault {
  creators: Creator[];
  subscribers: Subscriber[];
  suppliers: Supplier[];
}

function validateData(data: CreatorVault, subscriberId?: number): asserts data {
  if (!data || !data.creators.length || !data.subscribers.length || !data.suppliers.length) {
    throw new Error('Invalid data');
  }

  data.creators.forEach((creator) => validateCreator(creator));
  data.subscribers.forEach((subscriber) => validateSubscriber(subscriber));
  data.suppliers.forEach((supplier) => validateSupplier(supplier));

  if (subscriberId) {
    const subscriber = data.subscribers.find((s) => s.id === subscriberId);

    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    validateSubscriber(subscriber);
  }
}

function validateCreator(creator: Creator): asserts creator {
  if (!creator || !creator.id || !creator.name || !creator.contentThemes.length) {
    throw new Error('Invalid creator');
  }
}

function validateSupplier(supplier: Supplier): asserts supplier {
  if (!supplier || !supplier.id || !supplier.name || !supplier.products.length) {
    throw new Error('Invalid supplier');
  }

  supplier.products.forEach((product) => validateProduct(product));
}

function validateProduct(product: Product): asserts product {
  if (!product || !product.id || !product.name || !product.price || !product.theme.length) {
    throw new Error('Invalid product');
  }
}

function getCreatorIndex(creators: Creator[], creatorId: number): number {
  const index = findIndex(creators, { id: creatorId });

  if (index === -1) {
    throw new Error('Creator not found');
  }

  return index;
}

function getMatchingProducts(creatorVault: CreatorVault, subscriber: Subscriber): Product[] {
  return creatorVault.suppliers.flatMap((supplier) =>
    supplier.products.filter((product) =>
      product.theme.some((theme) => subscriber.themePreferences.includes(theme)) &&
      subscriber.creatorId === getCreatorIndex(creatorVault.creators, subscriber.creatorId)
    )
  );
}

function calculateTotalBoxValue(creatorVault: CreatorVault, subscriberId?: number): number {
  validateData(creatorVault, subscriberId);

  const subscriber = subscriberId ? creatorVault.subscribers.find((s) => s.id === subscriberId) : creatorVault.subscribers[0];

  let totalValue = 0;
  const matchingProducts = getMatchingProducts(creatorVault, subscriber);

  totalValue = matchingProducts.reduce((acc, product) => acc + product.price, 0);

  return totalValue;
}