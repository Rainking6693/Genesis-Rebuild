import React, { ReactNode, RefObject, useRef } from 'react';

interface RolePermissionsProps {
  message: string;
  children?: ReactNode;
  className?: string;
  dataTestid?: string;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({ message, children, className, dataTestid }) => {
  const messageRef = useRef<HTMLParagraphElement>(null);

  return (
    <div role="region" aria-labelledby="role-permissions-label" className={className} data-testid={dataTestid}>
      <h2 id="role-permissions-label" tabIndex={0} className="sr-only">
        Role Permissions
      </h2>
      {children && <div key="permissions-children">{children}</div>}
      <p ref={messageRef} data-testid="role-permissions-message">{message}</p>
    </div>
  );
};

export default RolePermissions;

// For the second component, let's use a more descriptive name based on the business context
import React, { ReactNode, RefObject, useRef } from 'react';

interface EcoTraceCommerceProps {
  message: string;
  children?: ReactNode;
  className?: string;
  dataTestid?: string;
}

const EcoTraceCommerce: React.FC<EcoTraceCommerceProps> = ({ message = 'Default EcoTrace Commerce Message', children, className, dataTestid }) => {
  const messageRef = useRef<HTMLParagraphElement>(null);

  return (
    <div role="region" aria-labelledby="eco-trace-commerce-label" className={className} data-testid={dataTestid}>
      <h2 id="eco-trace-commerce-label" tabIndex={0} className="sr-only">
        EcoTrace Commerce
      </h2>
      {children && <div key="commerce-children">{children}</div>}
      <p ref={messageRef} data-testid="eco-trace-commerce-message">{message}</p>
    </div>
  );
};

export default EcoTraceCommerce;

This updated code addresses the initial requirements and adds additional improvements for resiliency, edge cases, accessibility, and maintainability.