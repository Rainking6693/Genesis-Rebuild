import React, { FC, DetailedHTMLProps, Key } from 'react';
import PropTypes from 'prop-types';

// Define custom prop types for better type safety
interface BusinessNameProps {
  businessName?: string;
}

// Use DetailedHTMLProps to extend the default HTMLProps
type HTMLProps = DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

// Combine BusinessNameProps and HTMLProps to create the final Props type
type ReviewSyncAIComponentProps = BusinessNameProps & HTMLProps;

// Add a key prop for accessibility and React's key requirement
const ReviewSyncAIComponent: FC<ReviewSyncAIComponentProps> = ({ businessName, ...htmlProps }: ReviewSyncAIComponentProps) => {
  const key = htmlProps.id || businessName || `ReviewSyncAIComponent-${Math.random().toString(36).substring(7)}`;

  return <h1 {...htmlProps} key={key}>Welcome to ReviewSync AI, {businessName || 'ReviewSync AI'}!</h1>;
};

// Add error handling for potential missing business name
ReviewSyncAIComponent.defaultProps = {
  businessName: 'ReviewSync AI'
};

// Add type checking for props and make businessName optional
ReviewSyncAIComponent.propTypes = {
  businessName: PropTypes.string,
};

export default ReviewSyncAIComponent;

Changes made:

1. Added a key prop for accessibility and React's key requirement.
2. Made the businessName prop optional with a default value of 'ReviewSync AI'.
3. Updated the propTypes to make businessName optional.
4. Imported the Key type from React.
5. Used the ternary operator to display the businessName or the default value if it's not provided.