import React, { ReactNode } from 'react';
import { EcoMetricsProBrand } from '../brand'; // Assuming a brand component exists for consistency

type Props = {
  title: string;
  subtitle?: string | ReactNode;
  message: ReactNode;
};

const MyComponent: React.FC<Props> = ({ title, subtitle, message }) => {
  // Adding a default value for subtitle to prevent null errors
  const renderedSubtitle = subtitle || '';

  return (
    <div>
      <h2>{title}</h2>
      {/* Using a fragment to ensure subtitle is always a child of the div for accessibility */}
      <>
        {typeof renderedSubtitle === 'string' ? <p>{renderedSubtitle}</p> : renderedSubtitle}
      </>
      <EcoMetricsProBrand aria-label="EcoMetrics Pro Brand" />
      <p>{message}</p>
    </div>
  );
};

export default MyComponent;

import React, { ReactNode } from 'react';
import { EcoMetricsProBrand } from '../brand'; // Assuming a brand component exists for consistency

type Props = {
  title: string;
  subtitle?: string | ReactNode;
  message: ReactNode;
};

const MyComponent: React.FC<Props> = ({ title, subtitle, message }) => {
  // Adding a default value for subtitle to prevent null errors
  const renderedSubtitle = subtitle || '';

  return (
    <div>
      <h2>{title}</h2>
      {/* Using a fragment to ensure subtitle is always a child of the div for accessibility */}
      <>
        {typeof renderedSubtitle === 'string' ? <p>{renderedSubtitle}</p> : renderedSubtitle}
      </>
      <EcoMetricsProBrand aria-label="EcoMetrics Pro Brand" />
      <p>{message}</p>
    </div>
  );
};

export default MyComponent;