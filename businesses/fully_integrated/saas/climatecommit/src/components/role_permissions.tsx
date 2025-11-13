import React, { FC, ReactNode } from 'react';

interface RolePermissionsProps {
  message: ReactNode;
}

const RolePermissionsComponent: FC<RolePermissionsProps> = ({ message }) => {
  return <div role="alert" aria-label="Role Permissions Message">{message}</div>;
};

export default RolePermissionsComponent;

// For the second component, let's use a more descriptive name based on the business context
import React, { FC, ReactNode } from 'react';

interface ClimateCommitProps {
  message: ReactNode;
}

const ClimateCommitComponent: FC<ClimateCommitProps> = ({ message }) => {
  return <div role="alert" aria-label="Climate Commit Message">{message}</div>;
};

export default ClimateCommitComponent;

import React, { FC, ReactNode } from 'react';

interface RolePermissionsProps {
  message: ReactNode;
}

const RolePermissionsComponent: FC<RolePermissionsProps> = ({ message }) => {
  return <div role="alert" aria-label="Role Permissions Message">{message}</div>;
};

export default RolePermissionsComponent;

// For the second component, let's use a more descriptive name based on the business context
import React, { FC, ReactNode } from 'react';

interface ClimateCommitProps {
  message: ReactNode;
}

const ClimateCommitComponent: FC<ClimateCommitProps> = ({ message }) => {
  return <div role="alert" aria-label="Climate Commit Message">{message}</div>;
};

export default ClimateCommitComponent;