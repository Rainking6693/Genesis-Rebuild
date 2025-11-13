import React, { FC, useMemo } from 'react';
import { sanitizeUserInput } from '../../security/sanitizeUserInput';
import { isString } from 'lodash';

/**
 * Helper function to merge classNames
 * @param baseClassName Base class name
 * @param additionalClassNames Additional class names
 * @returns Merged class names
 */
function classNames(baseClassName: string, ...additionalClassNames: string[]) {
  return additionalClassNames.filter(isString).join(' ').trim() ? (
    `${baseClassName} ${additionalClassNames.filter(isString).join(' ')}`
  ) : baseClassName;
}

interface Props {
  message?: string;
  className?: string;
}

const SubscriptionManagement: FC<Props> = ({ message = '', className }) => {
  // Sanitize user input for security
  const sanitizeMessage = sanitizeUserInput(message || '');

  // Ensure message is provided to avoid potential errors
  if (!sanitizeMessage) {
    return <div className="subscription-management-message subscription-management-message--error" role="alert">
      Error: No message provided
    </div>;
  }

  // Add ARIA attributes for accessibility
  const classNamesValue = classNames('subscription-management-message', className);

  return (
    <div className={classNamesValue} role="alert">
      {sanitizeMessage}
    </div>
  );
};

SubscriptionManagement.displayName = 'EcoFlowSubscriptionManagement';
SubscriptionManagement.defaultProps = { message: '', className: '' };

// Optimize performance by memoizing the component if props are unchanged
export const MemoizedSubscriptionManagement = React.memo(SubscriptionManagement);

// Export default and named exports for better modularity and reusability
export { MemoizedSubscriptionManagement as SubscriptionManagement };
export default MemoizedSubscriptionManagement;

In this updated version, I've added the following improvements:

1. Added a default value for the `message` prop to avoid potential errors when the prop is not provided.
2. Added ARIA attributes for accessibility.
3. Created a utility function `classNames` to merge class names for better maintainability.
4. Added a check for empty class names before concatenating them.
5. Imported `isString` from lodash for better type safety.
6. Renamed the component to `SubscriptionManagement` for better naming conventions.
7. Exported both the default and named exports as `MemoizedSubscriptionManagement` for better performance.