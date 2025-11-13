import React, { FC, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  children?: ReactNode;
  key?: Key;
}

const MyComponent: FC<Props> = ({ message, children, key }) => {
  // Sanitize user-generated content to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Render children if provided
  const content = children || sanitizedMessage;

  return <div dangerouslySetInnerHTML={{ __html: content }} key={key} />;
};

MyComponent.defaultProps = {
  message: '',
  key: Math.random().toString(),
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default MyComponent;

1. Added `children` prop to allow for custom content within the component.
2. Checked if `children` are provided before rendering them, to avoid unexpected behavior.
3. Added PropTypes for `children`.
4. Used `ReactNode` instead of any for the `children` prop type.
5. Added a default value for the `key` prop to ensure it's always unique.
6. Removed the duplicate export default statement.