import React from 'react';

interface BaseComponentProps {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const BaseComponent: React.FC<BaseComponentProps> = ({ message, className, ariaLabel }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={className} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

// Add a default role for RolePermissionsComponent
interface RolePermissionsComponentProps extends BaseComponentProps {
  role?: string;
}

const RolePermissionsComponent: React.FC<RolePermissionsComponentProps> = (props) => {
  const { role, ...rest } = props;
  const handleRole = (role: string | undefined) => {
    if (!role) {
      return;
    }

    // Add your role-based logic here
    console.log(`Role: ${role}`);
  };

  handleRole(props.role);

  return <BaseComponent {...rest} />;
};

// Add a default aria-label for OtherComponent
interface OtherComponentProps extends BaseComponentProps {
  ariaLabel?: string;
}

const OtherComponent: React.FC<OtherComponentProps> = (props) => {
  const { ariaLabel = 'Default Component', ...rest } = props;

  return <BaseComponent {...rest} ariaLabel={ariaLabel} />;
};

export { BaseComponent, RolePermissionsComponent, OtherComponent };

In this version, I've added a default role for RolePermissionsComponent and a default aria-label for OtherComponent. I've also added a function to handle the role permissions in RolePermissionsComponent. You can replace the console.log with your actual role-based logic. Additionally, I've added a null check for the message in BaseComponent to prevent rendering when the message is undefined or null.