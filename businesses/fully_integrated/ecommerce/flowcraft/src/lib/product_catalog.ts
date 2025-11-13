import { Product } from './product.model';
import { ProductCatalogService } from './product-catalog.service';

export interface GetProductOptions {
  // Optional timeout for the request in milliseconds
  timeout?: number;

  // Optional error message for accessibility purposes
  errorMessage?: string;
}

export async function getProduct(productId: string, options?: GetProductOptions): Promise<Product | null> {
  const defaultOptions: GetProductOptions = {
    timeout: 5000,
    errorMessage: 'An error occurred while retrieving the product.',
  };
  const optionsWithDefaults = { ...defaultOptions, ...options };

  try {
    // Access the product catalog service
    const productCatalogService = new ProductCatalogService();

    // Call the service method to retrieve the product with the provided options
    const product = await productCatalogService.getProductById(productId, optionsWithDefaults);

    // Return the product if found, or null if not found
    return product || null;
  } catch (error) {
    // Log the error for debugging purposes
    console.error(`Error retrieving product with ID ${productId}:`, error);

    // Throw an error with the provided error message for accessibility
    throw new Error(optionsWithDefaults.errorMessage);
  }
}

// Add a custom error class for better maintainability
class ProductCatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductCatalogError';
  }
}

// Update the ProductCatalogService to throw custom errors
export class ProductCatalogService {
  async getProductById(productId: string, options: GetProductOptions): Promise<Product | null> {
    // Simulate an edge case where the product is not found
    if (!productId) {
      throw new ProductCatalogError('Product ID is required.');
    }

    // Simulate a timeout error
    if (options.timeout && Date.now() > options.timeout) {
      throw new ProductCatalogError('Request timed out.');
    }

    // Simulate a service error
    if (Math.random() > 0.9) {
      throw new ProductCatalogError('An error occurred while retrieving the product.');
    }

    // Return a sample product for demonstration purposes
    return {
      id: productId,
      name: 'Sample Product',
      description: 'This is a sample product.',
      price: 9.99,
    };
  }
}

import { Product } from './product.model';
import { ProductCatalogService } from './product-catalog.service';

export interface GetProductOptions {
  // Optional timeout for the request in milliseconds
  timeout?: number;

  // Optional error message for accessibility purposes
  errorMessage?: string;
}

export async function getProduct(productId: string, options?: GetProductOptions): Promise<Product | null> {
  const defaultOptions: GetProductOptions = {
    timeout: 5000,
    errorMessage: 'An error occurred while retrieving the product.',
  };
  const optionsWithDefaults = { ...defaultOptions, ...options };

  try {
    // Access the product catalog service
    const productCatalogService = new ProductCatalogService();

    // Call the service method to retrieve the product with the provided options
    const product = await productCatalogService.getProductById(productId, optionsWithDefaults);

    // Return the product if found, or null if not found
    return product || null;
  } catch (error) {
    // Log the error for debugging purposes
    console.error(`Error retrieving product with ID ${productId}:`, error);

    // Throw an error with the provided error message for accessibility
    throw new Error(optionsWithDefaults.errorMessage);
  }
}

// Add a custom error class for better maintainability
class ProductCatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductCatalogError';
  }
}

// Update the ProductCatalogService to throw custom errors
export class ProductCatalogService {
  async getProductById(productId: string, options: GetProductOptions): Promise<Product | null> {
    // Simulate an edge case where the product is not found
    if (!productId) {
      throw new ProductCatalogError('Product ID is required.');
    }

    // Simulate a timeout error
    if (options.timeout && Date.now() > options.timeout) {
      throw new ProductCatalogError('Request timed out.');
    }

    // Simulate a service error
    if (Math.random() > 0.9) {
      throw new ProductCatalogError('An error occurred while retrieving the product.');
    }

    // Return a sample product for demonstration purposes
    return {
      id: productId,
      name: 'Sample Product',
      description: 'This is a sample product.',
      price: 9.99,
    };
  }
}