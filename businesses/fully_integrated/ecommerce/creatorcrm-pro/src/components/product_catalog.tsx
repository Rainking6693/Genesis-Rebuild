import React, { FC, ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  as?: 'section' | 'article'; // Allow for custom HTML element for better semantics
  title: string; // Add a more descriptive title for the component
  productCatalogDescription?: string; // Make 'productCatalogDescription' optional
  children?: ReactNode; // Allow for additional content within the ProductCatalog
}

const ProductCatalog: FC<Props> = ({ as: Component = 'div', title, productCatalogDescription, children, ...rest }) => {
  return (
    <Component className="product-catalog" {...rest}>
      <h2 className="product-catalog__title" id="product-catalog-title">{title}</h2>
      {productCatalogDescription && <div className="product-catalog__description" id="product-catalog-description">{productCatalogDescription}</div>}
      {children && <div className="product-catalog__content">{children}</div>}
    </Component>
  );
};

export default ProductCatalog;

import React, { FC, ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  as?: 'section' | 'article'; // Allow for custom HTML element for better semantics
  title: string; // Add a more descriptive title for the component
  productCatalogDescription?: string; // Make 'productCatalogDescription' optional
  children?: ReactNode; // Allow for additional content within the ProductCatalog
}

const ProductCatalog: FC<Props> = ({ as: Component = 'div', title, productCatalogDescription, children, ...rest }) => {
  return (
    <Component className="product-catalog" {...rest}>
      <h2 className="product-catalog__title" id="product-catalog-title">{title}</h2>
      {productCatalogDescription && <div className="product-catalog__description" id="product-catalog-description">{productCatalogDescription}</div>}
      {children && <div className="product-catalog__content">{children}</div>}
    </Component>
  );
};

export default ProductCatalog;