import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
  className?: string;
}

const MyComponent: React.FC<Props & PropsWithChildren> = ({ id, className, children }) => {
  const { t } = useTranslation();

  // Check if message is provided, otherwise use default message from i18n
  const message = children || t(id);

  // Add ARIA attributes for accessibility
  const ariaLabel = t(`seo_optimization.${id}_aria_label`);
  const ariaDescribedBy = t(`seo_optimization.${id}_aria_describedby`);

  return (
    <div className={className} aria-label={ariaLabel} aria-describedby={ariaDescribedBy}>
      {message}
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
  className?: string;
}

const MyComponent: React.FC<Props & PropsWithChildren> = ({ id, className, children }) => {
  const { t } = useTranslation();

  // Check if message is provided, otherwise use default message from i18n
  const message = children || t(id);

  // Add ARIA attributes for accessibility
  const ariaLabel = t(`seo_optimization.${id}_aria_label`);
  const ariaDescribedBy = t(`seo_optimization.${id}_aria_describedby`);

  return (
    <div className={className} aria-label={ariaLabel} aria-describedby={ariaDescribedBy}>
      {message}
    </div>
  );
};

export default MyComponent;