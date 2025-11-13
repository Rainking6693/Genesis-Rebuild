import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, message, ...rest }) => {
  return (
    <div className={className} {...rest}>
      <h2 className="sr-only">Product Catalog</h2>
      <div className="product-catalog">
        <p>{message}</p>
        {/* Add your product items here */}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, message, ...rest }) => {
  return (
    <div className={className} {...rest}>
      <h2 className="sr-only">Product Catalog</h2>
      <div className="product-catalog">
        <p>{message}</p>
        {/* Add your product items here */}
      </div>
    </div>
  );
};

export default MyComponent;