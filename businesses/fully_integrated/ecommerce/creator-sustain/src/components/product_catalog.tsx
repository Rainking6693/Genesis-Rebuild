import React, { FC, ReactNode, ReactElement } from 'react';

interface Props {
  title: string;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  sustainabilityScore: number;
}

const Product: FC<Product> = ({ id, name, description, imageUrl, affiliateLink, sustainabilityScore }) => {
  return (
    <li key={id} role="listitem">
      <a href={affiliateLink} target="_blank" rel="noopener noreferrer" aria-label={`View ${name}`}>
        {name}
      </a>
      <img src={imageUrl} alt={name} />
      <p>Description: {description}</p>
      <p>Sustainability Score: {sustainabilityScore}</p>
    </li>
  );
};

const ProductCatalog: FC<Props> = ({ title, products }) => {
  if (!Array.isArray(products) || products === null || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <ul role="list" aria-label="Product list">
        {products.map((product) => (
          <Product key={product.id} data-testid="product" {...product} />
        )) as ReactElement<typeof Product>[])
      }
    </ul>
    </div>
  );
};

export default ProductCatalog;

In this updated version, I've added a type for the `title` prop, a type for the `sustainabilityScore` prop, and ARIA attributes to the `Product` component for better accessibility. I've also added a check for null or undefined `products` prop to handle edge cases. The `ul` element now has a `role` attribute and an `aria-label` attribute for better accessibility. Lastly, I've added a `data-testid` attribute to the `Product` component for easier testing.