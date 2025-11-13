import React, { PropsWithChildren, DetailedHTMLProps } from 'react';

type AriaAttributes = {
  /**
   * Optional id for accessibility.
   */
  'aria-labelledby'?: string;
};

interface Props extends DetailedHTMLProps<AriaAttributes, HTMLDivElement> {
  /**
   * The message to be displayed.
   */
  message: string;

  /**
   * Optional className for styling.
   */
  className?: string;

  /**
   * Optional 'aria-labelledby' for accessibility.
   */
  'aria-labelledby'?: string;
}

/**
 * MyComponent: A functional React component that displays a message.
 *
 * @param {PropsWithChildren<Props>} props - The component's props.
 * @returns {JSX.Element} A JSX element containing the message.
 */
const MyComponent: React.FC<PropsWithChildren<Props>> = ({
  children,
  message,
  className,
  id,
  'aria-labelledby': ariaLabelledby,
}) => {
  // Add a comment to explain the purpose of the component.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <div
      id={id}
      className={className}
      aria-labelledby={ariaLabelledby}
    >
      {/* Display the message in a div */}
      {children || message}
    </div>
  );
};

MyComponent.defaultProps = {
  children: undefined,
  className: '',
  id: undefined,
  'aria-labelledby': undefined,
};

export default MyComponent;

import React, { PropsWithChildren, DetailedHTMLProps } from 'react';

type AriaAttributes = {
  /**
   * Optional id for accessibility.
   */
  'aria-labelledby'?: string;
};

interface Props extends DetailedHTMLProps<AriaAttributes, HTMLDivElement> {
  /**
   * The message to be displayed.
   */
  message: string;

  /**
   * Optional className for styling.
   */
  className?: string;

  /**
   * Optional 'aria-labelledby' for accessibility.
   */
  'aria-labelledby'?: string;
}

/**
 * MyComponent: A functional React component that displays a message.
 *
 * @param {PropsWithChildren<Props>} props - The component's props.
 * @returns {JSX.Element} A JSX element containing the message.
 */
const MyComponent: React.FC<PropsWithChildren<Props>> = ({
  children,
  message,
  className,
  id,
  'aria-labelledby': ariaLabelledby,
}) => {
  // Add a comment to explain the purpose of the component.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <div
      id={id}
      className={className}
      aria-labelledby={ariaLabelledby}
    >
      {/* Display the message in a div */}
      {children || message}
    </div>
  );
};

MyComponent.defaultProps = {
  children: undefined,
  className: '',
  id: undefined,
  'aria-labelledby': undefined,
};

export default MyComponent;