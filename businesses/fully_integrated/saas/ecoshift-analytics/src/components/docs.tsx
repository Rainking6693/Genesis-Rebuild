import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoShiftAnalytics } from '../../../constants';

interface Props {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const MyFeatureSection: React.FC<Props> = ({
  title,
  subtitle,
  description,
  children,
  className,
}) => {
  const defaultSubtitle = 'Subtitle';
  const defaultDescription = 'This is a description.';

  return (
    <header className={className}>
      <h1 aria-label={title}>{title}</h1>
      <h2 id="subtitle" aria-describedby="title">{subtitle || defaultSubtitle}</h2>
      <p id="description" aria-describedby="title">
        {description || defaultDescription}
      </p>
      {children}
      <p>Powered by {EcoShiftAnalytics}</p>
    </header>
  );
};

export default MyFeatureSection;

import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoShiftAnalytics } from '../../../constants';

interface Props {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const MyFeatureSection: React.FC<Props> = ({
  title,
  subtitle,
  description,
  children,
  className,
}) => {
  const defaultSubtitle = 'Subtitle';
  const defaultDescription = 'This is a description.';

  return (
    <header className={className}>
      <h1 aria-label={title}>{title}</h1>
      <h2 id="subtitle" aria-describedby="title">{subtitle || defaultSubtitle}</h2>
      <p id="description" aria-describedby="title">
        {description || defaultDescription}
      </p>
      {children}
      <p>Powered by {EcoShiftAnalytics}</p>
    </header>
  );
};

export default MyFeatureSection;