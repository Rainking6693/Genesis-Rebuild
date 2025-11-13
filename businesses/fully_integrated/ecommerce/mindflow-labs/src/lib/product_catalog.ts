import { Product } from './product.model';
import { v4 as uuidv4 } from 'uuid';

export interface ProductCatalog {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export function createProductCatalog(name: string, description: string): ProductCatalog {
  const id = uuidv4();
  const products: Product[] = [];

  return {
    id,
    name,
    description,
    products,
  };
}

export function addProductToCatalog(catalog: ProductCatalog, product: Product): void {
  // Validate input data before adding it to the catalog
  if (!product) {
    throw new Error('Invalid product data');
  }

  // Check if the product already exists in the catalog
  const existingProduct = catalog.products.find((p) => p.id === product.id);
  if (existingProduct) {
    throw new Error('Product already exists in the catalog');
  }

  catalog.products.push(product);
}

export function getProductById(catalog: ProductCatalog, id: string): Product | undefined {
  return catalog.products.find((product) => product.id === id);
}

export function updateProductInCatalog(catalog: ProductCatalog, product: Product): void {
  const index = catalog.products.findIndex((p) => p.id === product.id);

  if (index === -1) {
    throw new Error('Product not found in the catalog');
  }

  // Validate input data before updating it in the catalog
  if (!product) {
    throw new Error('Invalid product data');
  }

  catalog.products[index] = product;
}

export function removeProductFromCatalog(catalog: ProductCatalog, id: string): void {
  const index = catalog.products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error('Product not found in the catalog');
  }

  catalog.products.splice(index, 1);
}

// Performance optimization:
// - Use efficient data structures and algorithms for searching and sorting products
// - Implement caching strategies for frequently accessed products (not implemented here)

// Maintainability improvements:
// - Use descriptive variable and function names
// - Add comments and documentation to explain complex logic
// - Implement unit tests for the functions (not implemented here)

// Accessibility:
// - Ensure that the catalog and product data are accessible to screen readers and other assistive technologies
// - Provide alternative text for images and other non-text content
// - Ensure that the user interface is navigable using only a keyboard

// Additional accessibility considerations:
// - Use ARIA attributes to improve the accessibility of interactive elements
// - Provide clear and concise error messages for users with disabilities

import { Product } from './product.model';
import { v4 as uuidv4 } from 'uuid';

export interface ProductCatalog {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export function createProductCatalog(name: string, description: string): ProductCatalog {
  const id = uuidv4();
  const products: Product[] = [];

  return {
    id,
    name,
    description,
    products,
  };
}

export function addProductToCatalog(catalog: ProductCatalog, product: Product): void {
  // Validate input data before adding it to the catalog
  if (!product) {
    throw new Error('Invalid product data');
  }

  // Check if the product already exists in the catalog
  const existingProduct = catalog.products.find((p) => p.id === product.id);
  if (existingProduct) {
    throw new Error('Product already exists in the catalog');
  }

  catalog.products.push(product);
}

export function getProductById(catalog: ProductCatalog, id: string): Product | undefined {
  return catalog.products.find((product) => product.id === id);
}

export function updateProductInCatalog(catalog: ProductCatalog, product: Product): void {
  const index = catalog.products.findIndex((p) => p.id === product.id);

  if (index === -1) {
    throw new Error('Product not found in the catalog');
  }

  // Validate input data before updating it in the catalog
  if (!product) {
    throw new Error('Invalid product data');
  }

  catalog.products[index] = product;
}

export function removeProductFromCatalog(catalog: ProductCatalog, id: string): void {
  const index = catalog.products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error('Product not found in the catalog');
  }

  catalog.products.splice(index, 1);
}

// Performance optimization:
// - Use efficient data structures and algorithms for searching and sorting products
// - Implement caching strategies for frequently accessed products (not implemented here)

// Maintainability improvements:
// - Use descriptive variable and function names
// - Add comments and documentation to explain complex logic
// - Implement unit tests for the functions (not implemented here)

// Accessibility:
// - Ensure that the catalog and product data are accessible to screen readers and other assistive technologies
// - Provide alternative text for images and other non-text content
// - Ensure that the user interface is navigable using only a keyboard

// Additional accessibility considerations:
// - Use ARIA attributes to improve the accessibility of interactive elements
// - Provide clear and concise error messages for users with disabilities