import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { sanitize } from './sanitize';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message?: string;
  role?: 'presentation' | 'alert' | 'status' | 'banner' | 'log' | string;
  title?: string;
  ariaLabel?: string;
  dataTestid?: string;
  className?: string;
};

const CustomerSupportBot: FC<Props> = ({
  message = 'Default Customer Support Bot Message',
  role = 'alert',
  title,
  ariaLabel = 'Customer Support Bot',
  dataTestid,
  className,
  ...rest
}) => {
  const sanitizedMessage = sanitize(message);
  const sanitizedDataTestid = dataTestid ? sanitize(dataTestid) : undefined;

  // Remove invalid HTML attributes
  const filteredRest = Object.entries(rest).reduce(
    (acc, [key, value]) =>
      value !== undefined && key !== 'dangerouslySetInnerHTML' ? { ...acc, [key]: value } : acc,
    {} as Record<string, any>
  );

  // Set default values for empty or missing props
  const defaultClassName = className || 'customer-support-bot';
  const defaultTitle = title || 'Customer Support Bot';

  return (
    <div
      className={defaultClassName}
      role={role}
      title={defaultTitle}
      aria-label={ariaLabel}
      data-testid={sanitizedDataTestid}
      {...filteredRest}
    >
      {sanitizedMessage}
    </div>
  );
};

export default CustomerSupportBot;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { sanitize } from './sanitize';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message?: string;
  role?: 'presentation' | 'alert' | 'status' | 'banner' | 'log' | string;
  title?: string;
  ariaLabel?: string;
  dataTestid?: string;
  className?: string;
};

const CustomerSupportBot: FC<Props> = ({
  message = 'Default Customer Support Bot Message',
  role = 'alert',
  title,
  ariaLabel = 'Customer Support Bot',
  dataTestid,
  className,
  ...rest
}) => {
  const sanitizedMessage = sanitize(message);
  const sanitizedDataTestid = dataTestid ? sanitize(dataTestid) : undefined;

  // Remove invalid HTML attributes
  const filteredRest = Object.entries(rest).reduce(
    (acc, [key, value]) =>
      value !== undefined && key !== 'dangerouslySetInnerHTML' ? { ...acc, [key]: value } : acc,
    {} as Record<string, any>
  );

  // Set default values for empty or missing props
  const defaultClassName = className || 'customer-support-bot';
  const defaultTitle = title || 'Customer Support Bot';

  return (
    <div
      className={defaultClassName}
      role={role}
      title={defaultTitle}
      aria-label={ariaLabel}
      data-testid={sanitizedDataTestid}
      {...filteredRest}
    >
      {sanitizedMessage}
    </div>
  );
};

export default CustomerSupportBot;