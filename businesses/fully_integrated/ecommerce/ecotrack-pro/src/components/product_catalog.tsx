import React, { FC, ReactNode } from 'react';

interface Props {
  title: string; // Rename 'message' to 'title' for better semantics
  description?: string; // Add optional description property
  children?: ReactNode; // Add support for additional child elements
  className?: string; // Add a class name for styling and accessibility
}

const ProductCatalog: FC<Props> = ({ title, description, children, className }) => {
  return (
    <div className={`product-catalog ${className}`}> // Add a class name for styling and accessibility
      <h2 className="product-catalog__title" aria-level={2}>{title}</h2> // Add a class name for styling and aria-level for accessibility
      {description && <p className="product-catalog__description">{description}</p>} // Add a class name for styling
      {children} // Render any additional child elements
    </div>
  );
};

export default ProductCatalog;

import React, { FC, ReactNode } from 'react';

interface Props {
  title: string; // Rename 'message' to 'title' for better semantics
  description?: string; // Add optional description property
  children?: ReactNode; // Add support for additional child elements
  className?: string; // Add a class name for styling and accessibility
}

const ProductCatalog: FC<Props> = ({ title, description, children, className }) => {
  return (
    <div className={`product-catalog ${className}`}> // Add a class name for styling and accessibility
      <h2 className="product-catalog__title" aria-level={2}>{title}</h2> // Add a class name for styling and aria-level for accessibility
      {description && <p className="product-catalog__description">{description}</p>} // Add a class name for styling
      {children} // Render any additional child elements
    </div>
  );
};

export default ProductCatalog;