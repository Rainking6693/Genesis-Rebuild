import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, className, children }) => {
  return (
    <div className={className}>
      {children || <>{message}</>}
    </div>
  );
};

MyComponent.defaultProps = {
  className: 'stripe-billing-message',
};

export default MyComponent;

<MyComponent message="Your billing information has been updated." />
<MyComponent message="Your billing information has been updated." className="custom-class">
  <strong>Important:</strong> Your billing information has been updated.
</MyComponent>

import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, className, children }) => {
  return (
    <div className={className}>
      {children || <>{message}</>}
    </div>
  );
};

MyComponent.defaultProps = {
  className: 'stripe-billing-message',
};

export default MyComponent;

<MyComponent message="Your billing information has been updated." />
<MyComponent message="Your billing information has been updated." className="custom-class">
  <strong>Important:</strong> Your billing information has been updated.
</MyComponent>

1. Added `className` prop to allow for custom styling.
2. Allowed for optional `children` prop to support additional content within the component.
3. Added default props for the `className` to ensure consistent styling.
4. Wrapped the message in a fragment (`<>{message}</>`) to ensure it's always a valid React element.
5. Imported `ReactNode` to allow for any valid React child element.
6. Imported `FC` (Functional Component) from 'react' to improve type safety.

Now, you can use the component like this: