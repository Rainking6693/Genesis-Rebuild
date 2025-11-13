import React, { FC, DetailedHTMLProps } from 'react';

interface BaseProps {
  /**
   * The unique ID for the component, used for accessibility purposes.
   */
  id?: string;
}

interface Props extends BaseProps {
  /**
   * The main content of the component.
   */
  message: string;
}

const MyComponent: FC<DetailedHTMLProps<Props, HTMLDivElement>> = ({ id, message }) => {
  return (
    <div id={id} role="presentation">
      <div id={`content-${id}`} aria-labelledby={id}>
        {message}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, DetailedHTMLProps } from 'react';

interface BaseProps {
  /**
   * The unique ID for the component, used for accessibility purposes.
   */
  id?: string;
}

interface Props extends BaseProps {
  /**
   * The main content of the component.
   */
  message: string;
}

const MyComponent: FC<DetailedHTMLProps<Props, HTMLDivElement>> = ({ id, message }) => {
  return (
    <div id={id} role="presentation">
      <div id={`content-${id}`} aria-labelledby={id}>
        {message}
      </div>
    </div>
  );
};

export default MyComponent;