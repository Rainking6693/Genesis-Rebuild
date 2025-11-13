import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface RolePermissionsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  role?: string;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({ id, role, ...props }) => {
  const label = role ? `Role Permissions for ${role}` : 'Role Permissions';

  return (
    <div {...props} role="region" aria-labelledby={id}>
      <h2 id={id} className="sr-only">{label}</h2>
      <div>{message}</div>
    </div>
  );
};

export default RolePermissions;

// For the second component, let's use a more descriptive name based on the business context
import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface CarbonFootprintProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  carbonFootprintValue?: number;
}

const CarbonFootprint: React.FC<CarbonFootprintProps> = ({ id, carbonFootprintValue, ...props }) => {
  const label = carbonFootprintValue ? `Carbon Footprint: ${carbonFootprintValue} kg CO2e` : 'Carbon Footprint';

  return (
    <div {...props} role="region" aria-labelledby={id}>
      <h2 id={id} className="sr-only">{label}</h2>
      <div>{message}</div>
    </div>
  );
};

export default CarbonFootprint;

In this updated code, I've added the `DetailedHTMLProps` type to the props of both components, which allows for a more explicit definition of the HTML attributes that can be passed to the components. I've also extracted the label text calculation into separate variables for better readability and maintainability. Lastly, I've used the spread operator (`...props`) to pass any additional HTML attributes to the root `div` element. This makes the components more flexible and easier to use in various contexts.