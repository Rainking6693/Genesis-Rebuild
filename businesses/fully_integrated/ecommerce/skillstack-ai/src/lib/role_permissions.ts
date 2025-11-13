import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: ReactNode;
  children?: ReactNode;
  isVisibleByDefault?: boolean;
}

const RolePermissionsMessage: FC<Props> = ({
  className,
  id,
  style,
  message,
  children,
  isVisibleByDefault = false,
  ...rest
}) => {
  const [isVisible, setVisibility] = React.useState(isVisibleByDefault);

  const handleClick = () => {
    setVisibility(!isVisible);
  };

  return (
    <div className={`role-permissions-message ${className}`} id={id} style={style} {...rest}>
      {isVisible && (
        <>
          {message}
          {children}
        </>
      )}
      <button type="button" onClick={handleClick} aria-label="Show/Hide Role Permissions Message">
        {isVisible ? 'Hide' : 'Show'} Role Permissions
      </button>
    </div>
  );
};

export { RolePermissionsMessage };

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: ReactNode;
  children?: ReactNode;
  isVisibleByDefault?: boolean;
}

const RolePermissionsMessage: FC<Props> = ({
  className,
  id,
  style,
  message,
  children,
  isVisibleByDefault = false,
  ...rest
}) => {
  const [isVisible, setVisibility] = React.useState(isVisibleByDefault);

  const handleClick = () => {
    setVisibility(!isVisible);
  };

  return (
    <div className={`role-permissions-message ${className}`} id={id} style={style} {...rest}>
      {isVisible && (
        <>
          {message}
          {children}
        </>
      )}
      <button type="button" onClick={handleClick} aria-label="Show/Hide Role Permissions Message">
        {isVisible ? 'Hide' : 'Show'} Role Permissions
      </button>
    </div>
  );
};

export { RolePermissionsMessage };