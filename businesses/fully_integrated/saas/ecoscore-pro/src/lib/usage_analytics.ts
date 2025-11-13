import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  ariaLabel?: string;
}

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  // ... existing code ...

  // Add error handling for missing or invalid props
  if (!title) {
    throw new Error('Title is required');
  }

  return (
    // ... existing code ...
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  return (
    <div role="region" aria-labelledby={ariaLabel} {...rest}>
      // ... existing code ...
    </div>
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  // ... existing code ...

  // Check for invalid ReactNode types
  if (typeof children !== 'string' && typeof children !== 'number' && !React.isValidElement(children)) {
    throw new Error('Invalid children type');
  }

  return (
    // ... existing code ...
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  return (
    <div role="region" aria-labelledby={ariaLabel} {...rest}>
      <h2 id={ariaLabel} tabIndex={0}>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  return (
    <div role="region" aria-labelledby={ariaLabel} data-testid="usage-analytics" {...rest}>
      <h2 id={ariaLabel} tabIndex={0}>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
};

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  ariaLabel?: string;
}

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  // ... existing code ...

  // Add error handling for missing or invalid props
  if (!title) {
    throw new Error('Title is required');
  }

  return (
    // ... existing code ...
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  return (
    <div role="region" aria-labelledby={ariaLabel} {...rest}>
      // ... existing code ...
    </div>
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  // ... existing code ...

  // Check for invalid ReactNode types
  if (typeof children !== 'string' && typeof children !== 'number' && !React.isValidElement(children)) {
    throw new Error('Invalid children type');
  }

  return (
    // ... existing code ...
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  return (
    <div role="region" aria-labelledby={ariaLabel} {...rest}>
      <h2 id={ariaLabel} tabIndex={0}>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
};

// ... existing code ...

const UsageAnalytics: FC<Props> = ({ title, subtitle, children, ariaLabel, ...rest }) => {
  return (
    <div role="region" aria-labelledby={ariaLabel} data-testid="usage-analytics" {...rest}>
      <h2 id={ariaLabel} tabIndex={0}>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
};

2. Added a `role` attribute to the `div` to explicitly indicate that it is a `region`:

3. Added a check for invalid `ReactNode` types:

4. Added a `tabIndex` attribute to the `h2` element to make it focusable for keyboard users:

5. Added a `data-testid` attribute for easier testing: