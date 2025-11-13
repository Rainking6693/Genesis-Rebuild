import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  contracts?: Contract[];
}

interface Contract {
  id: string;
  name: string;
  category: string;
  price: number;
  details?: string;
}

const ProductCatalog: FC<Props> = ({ title, description, contracts }) => {
  if (!contracts) return null;

  return (
    <div className="product-catalog" role="list">
      <h1 id="product-catalog-title">{title}</h1>
      {description && <p id="product-catalog-description">{description}</p>}
      <ul role="list">
        {contracts.map((contract) => (
          <li key={contract.id} role="listitem">
            <h2 id={`contract-${contract.id}-title`} title={contract.name}>
              {contract.name}
            </h2>
            <p>Category: {contract.category}</p>
            <p>Price: ${contract.price}</p>
            {contract.details && (
              <p aria-hidden="false" id={`contract-${contract.id}-details`}>
                Details: {contract.details}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;

import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  contracts?: Contract[];
}

interface Contract {
  id: string;
  name: string;
  category: string;
  price: number;
  details?: string;
}

const ProductCatalog: FC<Props> = ({ title, description, contracts }) => {
  if (!contracts) return null;

  return (
    <div className="product-catalog" role="list">
      <h1 id="product-catalog-title">{title}</h1>
      {description && <p id="product-catalog-description">{description}</p>}
      <ul role="list">
        {contracts.map((contract) => (
          <li key={contract.id} role="listitem">
            <h2 id={`contract-${contract.id}-title`} title={contract.name}>
              {contract.name}
            </h2>
            <p>Category: {contract.category}</p>
            <p>Price: ${contract.price}</p>
            {contract.details && (
              <p aria-hidden="false" id={`contract-${contract.id}-details`}>
                Details: {contract.details}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;