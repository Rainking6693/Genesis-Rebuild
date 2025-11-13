import React, { ReactNode, FC } from 'react';

interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  fallbackSrc?: string;
}

interface Props {
  products: Product[];
}

const Product: FC<Product> = ({ id, name, description, imageUrl, price, fallbackSrc }) => {
  const altText = name || 'Product';

  return (
    <div>
      <h3>{name}</h3>
      <img
        src={imageUrl}
        alt={altText}
        role="img"
        aria-label={altText}
        loading="lazy"
        minWidth="100"
        minHeight="100"
        fallbackSrc={fallbackSrc}
      />
      {description && <p>{description}</p>}
      <p>Price: ${price}</p>
    </div>
  );
};

const ProductList: FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="product-catalog">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
};

const ProductCatalog: FC<Props> = ({ products }) => {
  return <ProductList products={products} />;
};

export default ProductCatalog;

This updated code addresses the requested improvements and provides a more robust, accessible, and maintainable product catalog component.