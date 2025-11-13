import React, { FunctionComponent, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  ariaLabel?: string;
}

const ClimatePulseComponent: FunctionComponent<Props> = ({ message, className, id, role, ariaLabel = 'Climate Pulse Message', ...rest }) => {
  if (!message) message = '';

  return (
    <div
      {...rest}
      className={className}
      data-testid="climate-pulse-message"
      id="climate-pulse-message"
      role="alert"
      aria-label={ariaLabel}
    >
      <div className="climate-pulse-message">
        {message}
      </div>
    </div>
  );
};

ClimatePulseComponent.displayName = 'ClimatePulseComponent';

export default ClimatePulseComponent;

import React, { FunctionComponent, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  ariaLabel?: string;
}

const ClimatePulseComponent: FunctionComponent<Props> = ({ message, className, id, role, ariaLabel = 'Climate Pulse Message', ...rest }) => {
  if (!message) message = '';

  return (
    <div
      {...rest}
      className={className}
      data-testid="climate-pulse-message"
      id="climate-pulse-message"
      role="alert"
      aria-label={ariaLabel}
    >
      <div className="climate-pulse-message">
        {message}
      </div>
    </div>
  );
};

ClimatePulseComponent.displayName = 'ClimatePulseComponent';

export default ClimatePulseComponent;