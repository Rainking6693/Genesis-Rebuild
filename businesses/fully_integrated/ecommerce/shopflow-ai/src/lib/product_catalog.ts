import { assert } from 'console';

/**
 * Type for a product in the catalog.
 */
type Product = {
  id: string;
  name: string;
  price: number;
  description?: string; // Add optional property for description
};

/**
 * Function to validate a product object.
 *
 * @param product - The product object to validate.
 * @throws {Error} If the product object is missing required properties.
 */
function validateProduct(product: Product): void {
  const requiredProperties = ['id', 'name', 'price'];

  requiredProperties.forEach((property) => {
    if (!product.hasOwnProperty(property)) {
      throw new Error(`Missing required property: ${property}`);
    }
  });

  // Additional checks for edge cases
  if (typeof product.id !== 'string' || product.id.trim() === '') {
    throw new Error('Invalid product ID.');
  }

  if (typeof product.price !== 'number' || product.price < 0) {
    throw new Error('Invalid product price.');
  }

  // Check if description is provided and it's a string
  if (product.description && typeof product.description !== 'string') {
    throw new Error('Invalid product description.');
  }
}

/**
 * Function to calculate the sum of two numbers.
 * This function is designed for use in the ShopFlow AI system.
 *
 * @param num1 - The first number.
 * @param num2 - The second number.
 * @returns {number} The sum of the two numbers.
 */
function calculateSum(num1: number, num2: number): number {
  // Check for NaN or non-number values
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Return the sum of the two numbers
  return num1 + num2;
}

/**
 * Function to add a product to the catalog.
 *
 * @param product - The product to add.
 * @param catalog - The catalog to add the product to.
 * @returns {Product[]} The updated catalog.
 */
function addProduct(product: Product, catalog: Product[]): Product[] {
  validateProduct(product);

  // Add the product to the catalog
  const updatedCatalog = [...catalog, product];

  // Log the added product for accessibility purposes
  console.log(`Added product: ${JSON.stringify(product)}`);

  return updatedCatalog;
}

/**
 * Function to get the total price of products in the catalog.
 *
 * @param catalog - The catalog to get the total price from.
 * @returns {number} The total price of the products in the catalog.
 */
function getTotalPrice(catalog: Product[]): number {
  let totalPrice = 0;

  for (const product of catalog) {
    totalPrice += product.price;
  }

  return totalPrice;
}

/**
 * Function to check if the catalog is empty.
 *
 * @param catalog - The catalog to check.
 * @returns {boolean} True if the catalog is empty, false otherwise.
 */
function isCatalogEmpty(catalog: Product[]): boolean {
  return catalog.length === 0;
}

/**
 * Function to remove a product from the catalog by its ID.
 *
 * @param id - The ID of the product to remove.
 * @param catalog - The catalog to remove the product from.
 * @returns {Product[]} The updated catalog.
 */
function removeProductById(id: string, catalog: Product[]): Product[] {
  // Filter out the product with the given ID
  const updatedCatalog = catalog.filter((product) => product.id !== id);

  // Log the removed product for accessibility purposes
  const removedProduct = catalog.find((product) => product.id === id);
  if (removedProduct) {
    console.log(`Removed product: ${JSON.stringify(removedProduct)}`);
  }

  return updatedCatalog;
}

/**
 * Function to update a product in the catalog by its ID.
 *
 * @param id - The ID of the product to update.
 * @param updatedProduct - The updated product object.
 * @param catalog - The catalog to update the product in.
 * @returns {Product[]} The updated catalog.
 */
function updateProductById(id: string, updatedProduct: Product, catalog: Product[]): Product[] {
  // Find the product with the given ID
  const productIndex = catalog.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    throw new Error(`Product with ID "${id}" not found.`);
  }

  // Update the product at the found index
  catalog[productIndex] = updatedProduct;

  // Log the updated product for accessibility purposes
  console.log(`Updated product: ${JSON.stringify(updatedProduct)}`);

  return catalog;
}

import { assert } from 'console';

/**
 * Type for a product in the catalog.
 */
type Product = {
  id: string;
  name: string;
  price: number;
  description?: string; // Add optional property for description
};

/**
 * Function to validate a product object.
 *
 * @param product - The product object to validate.
 * @throws {Error} If the product object is missing required properties.
 */
function validateProduct(product: Product): void {
  const requiredProperties = ['id', 'name', 'price'];

  requiredProperties.forEach((property) => {
    if (!product.hasOwnProperty(property)) {
      throw new Error(`Missing required property: ${property}`);
    }
  });

  // Additional checks for edge cases
  if (typeof product.id !== 'string' || product.id.trim() === '') {
    throw new Error('Invalid product ID.');
  }

  if (typeof product.price !== 'number' || product.price < 0) {
    throw new Error('Invalid product price.');
  }

  // Check if description is provided and it's a string
  if (product.description && typeof product.description !== 'string') {
    throw new Error('Invalid product description.');
  }
}

/**
 * Function to calculate the sum of two numbers.
 * This function is designed for use in the ShopFlow AI system.
 *
 * @param num1 - The first number.
 * @param num2 - The second number.
 * @returns {number} The sum of the two numbers.
 */
function calculateSum(num1: number, num2: number): number {
  // Check for NaN or non-number values
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Return the sum of the two numbers
  return num1 + num2;
}

/**
 * Function to add a product to the catalog.
 *
 * @param product - The product to add.
 * @param catalog - The catalog to add the product to.
 * @returns {Product[]} The updated catalog.
 */
function addProduct(product: Product, catalog: Product[]): Product[] {
  validateProduct(product);

  // Add the product to the catalog
  const updatedCatalog = [...catalog, product];

  // Log the added product for accessibility purposes
  console.log(`Added product: ${JSON.stringify(product)}`);

  return updatedCatalog;
}

/**
 * Function to get the total price of products in the catalog.
 *
 * @param catalog - The catalog to get the total price from.
 * @returns {number} The total price of the products in the catalog.
 */
function getTotalPrice(catalog: Product[]): number {
  let totalPrice = 0;

  for (const product of catalog) {
    totalPrice += product.price;
  }

  return totalPrice;
}

/**
 * Function to check if the catalog is empty.
 *
 * @param catalog - The catalog to check.
 * @returns {boolean} True if the catalog is empty, false otherwise.
 */
function isCatalogEmpty(catalog: Product[]): boolean {
  return catalog.length === 0;
}

/**
 * Function to remove a product from the catalog by its ID.
 *
 * @param id - The ID of the product to remove.
 * @param catalog - The catalog to remove the product from.
 * @returns {Product[]} The updated catalog.
 */
function removeProductById(id: string, catalog: Product[]): Product[] {
  // Filter out the product with the given ID
  const updatedCatalog = catalog.filter((product) => product.id !== id);

  // Log the removed product for accessibility purposes
  const removedProduct = catalog.find((product) => product.id === id);
  if (removedProduct) {
    console.log(`Removed product: ${JSON.stringify(removedProduct)}`);
  }

  return updatedCatalog;
}

/**
 * Function to update a product in the catalog by its ID.
 *
 * @param id - The ID of the product to update.
 * @param updatedProduct - The updated product object.
 * @param catalog - The catalog to update the product in.
 * @returns {Product[]} The updated catalog.
 */
function updateProductById(id: string, updatedProduct: Product, catalog: Product[]): Product[] {
  // Find the product with the given ID
  const productIndex = catalog.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    throw new Error(`Product with ID "${id}" not found.`);
  }

  // Update the product at the found index
  catalog[productIndex] = updatedProduct;

  // Log the updated product for accessibility purposes
  console.log(`Updated product: ${JSON.stringify(updatedProduct)}`);

  return catalog;
}