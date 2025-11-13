import React, { FunctionComponent, ReactNode, ReactPortal } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  message?: string;
  id?: string;
  className?: string;
  ariaLabel?: string;
}

const ABBTestingComponent: FunctionComponent<Props> = ({
  children,
  message,
  id,
  className,
  ariaLabel,
}) => {
  if (message && typeof message !== 'string') {
    throw new Error('The "message" prop must be a string or undefined.');
  }

  return (
    <div
      id={id}
      className={className}
      aria-label={ariaLabel}
    >
      {children || (message && <span>{message}</span>)}
    </div>
  );
};

ABBTestingComponent.defaultProps = {
  message: undefined,
};

ABBTestingComponent.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default ABBTestingComponent;

// Usage example with ReactDOM.createPortal
import React from 'react';
import ReactDOM from 'react-dom';
import ABBTestingComponent from './ABBTestingComponent';

const container = document.getElementById('my-container');

const portal: ReactPortal = (
  <ABBTestingComponent message="Test message" id="test-component" />
);

ReactDOM.createPortal(portal, container);

1. Added `ReactNode` to the `children` prop type to allow for any valid React child.
2. Added `id`, `className`, and `ariaLabel` props to provide more flexibility and accessibility.
3. Thrown an error if the `message` prop is not a string or undefined.
4. Added a default value for the `message` prop (undefined).
5. Added the `aria-label` prop to improve accessibility for screen readers.
6. Wrapped the `message` with the `children` prop to allow for custom content within the component.
7. Added a check for the `children` prop to ensure it's not required when using the `message` prop.
8. Used `ReactDOM.createPortal` to render the component as a child of a specific DOM element, if needed, to improve resiliency and maintainability.