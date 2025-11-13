import React, { FC, ReactNode, Key } from 'react';

interface Props {
  title: string;
  description?: string; // made description optional
  products: Product[];
  className?: string; // added a class name prop for styling
}

interface Product {
  id: string;
  name: string;
  description?: string; // made description optional
  carbonOffset: number;
  impactTrackingUrl: string;
  verified: boolean;
}

const ProductCatalog: FC<Props> = ({ title, description, products, className }) => {
  // Added a check for description to prevent null error
  const catalogDescription = description || 'No description provided';

  return (
    <div className={className}>
      <h1>{title}</h1>
      <p>{catalogDescription}</p>
      <ul role="list">
        {products.map((product) => (
          // Added a check for product.name to prevent null error
          product.name && (
            <li key={product.id} data-testid="product-item" tabIndex={0} aria-labelledby={`product-name-${product.id}`} aria-describedby={`impact-tracking-${product.id}`}>
              <h2 id={`product-name-${product.id}`}>{product.name}</h2>
              <p>Carbon Offset: {product.carbonOffset} tons</p>
              <p id={`impact-tracking-${product.id}`} aria-hidden={!product.verified}>Impact Tracking: <a href={product.impactTrackingUrl} aria-label={`View impact tracking for ${product.name}`}>{product.impactTrackingUrl}</a></p>
              {product.verified && <p aria-hidden={!product.verified}>Verified</p>}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;

This updated code addresses the requested improvements and makes the component more resilient, accessible, and maintainable.