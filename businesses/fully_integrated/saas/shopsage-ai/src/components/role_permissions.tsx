import { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type RolePermissionsProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  children?: ReactNode;
};

const RolePermissionsComponent: React.FC<RolePermissionsProps> = ({ message, children, ...props }) => {
  if (!message || message.trim() === '') {
    throw new Error('RolePermissionsComponent: message is required and should not be an empty string.');
  }

  return (
    <div role="alert" className="role-permissions-component" {...props}>
      <p>{message}</p>
      {children}
    </div>
  );
};

export default RolePermissionsComponent;

type MyComponentProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  children?: ReactNode;
};

const MyComponent: React.FC<MyComponentProps> = ({ message, children, ...props }) => {
  if (!message || message.trim() === '') {
    throw new Error('MyComponent: message is required and should not be an empty string.');
  }

  return (
    <div role="alert" className="my-component" {...props}>
      <p>{message}</p>
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  children: null,
};

export default MyComponent;

In this refactored code, I've used the `DetailedHTMLProps` utility type to simplify the props definition and added a default value for the `children` prop using the `defaultProps` static property. This ensures that the components can still function correctly even when the `children` prop is not provided. Additionally, I've added a check for non-empty strings for the `message` prop to ensure that it's not an empty string before rendering the component. This helps prevent potential issues and improves the maintainability of the code.