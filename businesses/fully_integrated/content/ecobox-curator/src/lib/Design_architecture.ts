import React, { FC, ReactNode, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';

interface EcoBoxCuratorProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
  customAriaLabel?: string;
}

const EcoBoxCuratorComponent: FC<EcoBoxCuratorProps> = ({ message, children, className, customAriaLabel, ...rest }) => {
  const sanitizedMessage = message ? message.replace(/<[^>]+>/g, '').trim() : ''; // Remove any HTML tags and trim the message

  return (
    <div
      className={className}
      {...rest}
      aria-label={customAriaLabel || 'EcoBoxCurator'} // Use the provided customAriaLabel if available, otherwise use the default one
    >
      {children || sanitizedMessage}
    </div>
  );
};

EcoBoxCuratorComponent.defaultProps = {
  message: '',
  children: null,
  className: '',
  customAriaLabel: 'EcoBoxCurator',
};

EcoBoxCuratorComponent.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  customAriaLabel: PropTypes.string,
};

export { EcoBoxCuratorComponent as EcoBoxCurator };

In this updated version:

1. I've used the `DetailedHTMLProps` from React to include all the HTML attributes as props, making the component more flexible and resilient.
2. I've added a `customAriaLabel` prop to allow for custom labels for screen readers.
3. I've used a more descriptive component name, `EcoBoxCuratorComponent`.
4. I've exported the component with a meaningful name, `EcoBoxCurator`.
5. I've used more descriptive prop types for better type safety.
6. I've added a check for the `message` to ensure it's not empty before sanitizing it, which helps prevent potential edge cases.
7. I've used the spread operator (`...rest`) to pass all the remaining HTML attributes to the `div` element, improving maintainability.