import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  message: string;
  className?: string | undefined;
  ariaLabel?: string | undefined;
  dataTestid?: string;
}

const ReportingEngineMessage: React.FC<Props> = ({
  message,
  className,
  ariaLabel,
  dataTestid,
}) => {
  // Added a default className for consistent styling
  const defaultClassName = 'reporting-engine-message';
  const finalClassName = className || defaultClassName;

  // Added a default ariaLabel for accessibility
  const defaultAriaLabel = 'Reporting Engine Message';
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  return (
    <div
      className={finalClassName}
      aria-label={finalAriaLabel}
      role="alert"
      data-testid={dataTestid}
    >
      {message}
    </div>
  );
};

ReportingEngineMessage.displayName = 'ReportingEngineMessage';

export default ReportingEngineMessage;

import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  message: string;
  className?: string | undefined;
  ariaLabel?: string | undefined;
  dataTestid?: string;
}

const ReportingEngineMessage: React.FC<Props> = ({
  message,
  className,
  ariaLabel,
  dataTestid,
}) => {
  // Added a default className for consistent styling
  const defaultClassName = 'reporting-engine-message';
  const finalClassName = className || defaultClassName;

  // Added a default ariaLabel for accessibility
  const defaultAriaLabel = 'Reporting Engine Message';
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  return (
    <div
      className={finalClassName}
      aria-label={finalAriaLabel}
      role="alert"
      data-testid={dataTestid}
    >
      {message}
    </div>
  );
};

ReportingEngineMessage.displayName = 'ReportingEngineMessage';

export default ReportingEngineMessage;