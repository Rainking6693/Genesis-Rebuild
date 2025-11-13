import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, id, message, ...rest }) => {
  return (
    <div id={id} className={className} {...rest}>
      <h2 className="sr-only">Product Catalog</h2>
      <div className="product-catalog">
        <h1>{message}</h1>
        {/* Add your product list here */}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, id, message, ...rest }) => {
  return (
    <div id={id} className={className} {...rest}>
      <h2 className="sr-only">Product Catalog</h2>
      <div className="product-catalog">
        <h1>{message}</h1>
        {/* Add your product list here */}
      </div>
    </div>
  );
};

export default MyComponent;