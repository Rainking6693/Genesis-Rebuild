import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface EcoTraceProductMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  environmentalImpact: string; // Add more specific types if available
  ariaLabel?: string; // Add a prop for accessibility
}

const EcoTraceProductMessage: FC<EcoTraceProductMessageProps> = ({
  environmentalImpact,
  className,
  ariaLabel,
  ...rest
}) => {
  // Add error handling for environmentalImpact
  if (!environmentalImpact) {
    return <div>Error: Environmental impact is required</div>;
  }

  // Add a wrapper for accessibility and custom styling
  return (
    <div
      className={className}
      aria-label={ariaLabel}
      {...rest} // Include any additional props passed to the component
    >
      {environmentalImpact}
    </div>
  );
};

export default EcoTraceProductMessage;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface EcoTraceProductMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  environmentalImpact: string; // Add more specific types if available
  ariaLabel?: string; // Add a prop for accessibility
}

const EcoTraceProductMessage: FC<EcoTraceProductMessageProps> = ({
  environmentalImpact,
  className,
  ariaLabel,
  ...rest
}) => {
  // Add error handling for environmentalImpact
  if (!environmentalImpact) {
    return <div>Error: Environmental impact is required</div>;
  }

  // Add a wrapper for accessibility and custom styling
  return (
    <div
      className={className}
      aria-label={ariaLabel}
      {...rest} // Include any additional props passed to the component
    >
      {environmentalImpact}
    </div>
  );
};

export default EcoTraceProductMessage;