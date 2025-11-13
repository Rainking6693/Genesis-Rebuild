import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { RoleBasedAccessControl } from '@genesis/security-agent';

type Props = DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  role: RoleBasedAccessControl;
  children?: ReactNode; // Allows for custom content within the component
  fallbackContent?: ReactNode; // Provide a custom fallback content for access-restricted content
};

const MyComponent: React.FC<Props> = ({
  message,
  role,
  children,
  fallbackContent = <div>Access Denied</div>,
  ...rest
}) => {
  if (!role.hasPermission('view_ecoscore_analytics')) {
    return <div {...rest}>{fallbackContent}</div>;
  }

  // Check if children are provided and render them if so
  return children ? (
    <div {...rest}>{children}</div>
  ) : (
    <div {...rest}>{message}</div>
  );
};

MyComponent.defaultProps = {
  children: null,
  fallbackContent: <div>Access Denied</div>,
};

export default MyComponent;

In this updated version, I've made the following changes:

1. Imported `DetailedHTMLProps` to get access to the `HTMLAttributes` type, which allows for passing additional props to the component.
2. Added a `fallbackContent` prop to provide a custom fallback content for access-restricted content.
3. Passed the additional props (`rest`) to the component's root div, allowing for better accessibility and maintainability.
4. Used the `DetailedHTMLProps` type to ensure type safety for the additional props.
5. Removed the duplicate import statement.