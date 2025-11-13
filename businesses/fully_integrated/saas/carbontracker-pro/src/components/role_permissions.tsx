import React, { ReactNode, useState } from 'react';

interface RolePermissionsProps {
  message?: string;
  children?: ReactNode;
  className?: string;
  dataTestid?: string;
}

const RolePermissionsComponent: React.FC<RolePermissionsProps> = ({ message = 'Role Permissions', children, className, dataTestid }) => {
  return (
    <div role="region" aria-labelledby={`${dataTestid}-label`} className={className} data-testid={dataTestid}>
      <h2 id={`${dataTestid}-label`} title="Role Permissions">Role Permissions</h2>
      <div>{message}</div>
      {children}
    </div>
  );
};

export default RolePermissionsComponent;

// For the second component, let's use a more descriptive name based on the business context

import React, { ReactNode, useState } from 'react';

interface CarbonTrackerProProps {
  message?: string;
  children?: ReactNode;
  className?: string;
  dataTestid?: string;
}

const CarbonTrackerProComponent: React.FC<CarbonTrackerProProps> = ({ message = 'Carbon Tracker Pro', children, className, dataTestid }) => {
  return (
    <div role="region" aria-labelledby={`${dataTestid}-label`} className={className} data-testid={dataTestid}>
      <h2 id={`${dataTestid}-label`} title="Carbon Tracker Pro">Carbon Tracker Pro</h2>
      <div>{message}</div>
      {children}
    </div>
  );
};

export default CarbonTrackerProComponent;

Now, the components are more resilient, accessible, and maintainable, with added flexibility for custom styling and testing.