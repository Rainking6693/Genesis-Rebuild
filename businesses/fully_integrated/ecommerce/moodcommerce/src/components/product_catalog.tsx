// Product.tsx
import React from 'react';

interface ProductProps {
  product: Product;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <article className="product">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </article>
  );
};

export default Product;

// Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
}

// ProductCatalog.tsx
import React, { useState } from 'react';
import Product from './Product';
import { MOOD_MESSAGES } from './Messages';

interface Props {
  mood: keyof typeof MOOD_MESSAGES;
}

const ProductCatalog: React.FC<Props> = ({ mood }) => {
  const [products, setProducts] = useState(MOOD_MESSAGES[mood].products);

  // Add error handling for missing products or invalid mood
  if (!products || products.length === 0) {
    return (
      <div>
        <h2>An error occurred while loading products.</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>{MOOD_MESSAGES[mood].message}</h2>
      <div className="product-list">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;

// Messages.ts
export const MOOD_MESSAGES = {
  HAPPY: {
    message: 'You look happy! Here are some products that will make you smile.',
    products: [
      { id: '1', name: 'Product 1', description: 'A happy product' },
      { id: '2', name: 'Product 2', description: 'Another happy product' },
    ],
  },
  SAD: {
    message: 'We understand you might be feeling down. Let us help you find something to cheer you up.',
    products: [
      { id: '3', name: 'Product 3', description: 'A product to cheer you up' },
      { id: '4', name: 'Product 4', description: 'Another product to cheer you up' },
    ],
  },
  ANXIOUS: {
    message: 'It seems you're feeling anxious. Take a moment to breathe and explore these calming products.',
    products: [
      { id: '5', name: 'Product 5', description: 'A calming product' },
      { id: '6', name: 'Product 6', description: 'Another calming product' },
    ],
  },
  // Add more messages as needed
};

// Product.tsx
import React from 'react';

interface ProductProps {
  product: Product;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <article className="product">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </article>
  );
};

export default Product;

// Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
}

// ProductCatalog.tsx
import React, { useState } from 'react';
import Product from './Product';
import { MOOD_MESSAGES } from './Messages';

interface Props {
  mood: keyof typeof MOOD_MESSAGES;
}

const ProductCatalog: React.FC<Props> = ({ mood }) => {
  const [products, setProducts] = useState(MOOD_MESSAGES[mood].products);

  // Add error handling for missing products or invalid mood
  if (!products || products.length === 0) {
    return (
      <div>
        <h2>An error occurred while loading products.</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>{MOOD_MESSAGES[mood].message}</h2>
      <div className="product-list">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;

// Messages.ts
export const MOOD_MESSAGES = {
  HAPPY: {
    message: 'You look happy! Here are some products that will make you smile.',
    products: [
      { id: '1', name: 'Product 1', description: 'A happy product' },
      { id: '2', name: 'Product 2', description: 'Another happy product' },
    ],
  },
  SAD: {
    message: 'We understand you might be feeling down. Let us help you find something to cheer you up.',
    products: [
      { id: '3', name: 'Product 3', description: 'A product to cheer you up' },
      { id: '4', name: 'Product 4', description: 'Another product to cheer you up' },
    ],
  },
  ANXIOUS: {
    message: 'It seems you're feeling anxious. Take a moment to breathe and explore these calming products.',
    products: [
      { id: '5', name: 'Product 5', description: 'A calming product' },
      { id: '6', name: 'Product 6', description: 'Another calming product' },
    ],
  },
  // Add more messages as needed
};