import React, { memo, useMemo } from 'react';

interface DashboardCardProps {
  title?: string;
  content?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = memo(({ title, content, className = '' }) => {
  const cardClassName = useMemo(() => `dashboard-card ${className}`, [className]);
  const titleClassName = useMemo(() => `dashboard-card__title ${title ? '' : 'dashboard-card__title--empty'}`, [title]);
  const contentClassName = useMemo(() => `dashboard-card__content ${content ? '' : 'dashboard-card__content--empty'}`, [content]);

  return (
    <div className={cardClassName} aria-label={title || 'Dashboard Card'}>
      <h2 className={titleClassName} aria-label={title || 'No Title'}>
        {title || 'No Title'}
      </h2>
      <p className={contentClassName} aria-label={content || 'No Content'}>
        {content || 'No Content'}
      </p>
    </div>
  );
});

export default DashboardCard;

import React, { memo, useMemo } from 'react';

interface DashboardCardProps {
  title?: string;
  content?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = memo(({ title, content, className = '' }) => {
  const cardClassName = useMemo(() => `dashboard-card ${className}`, [className]);
  const titleClassName = useMemo(() => `dashboard-card__title ${title ? '' : 'dashboard-card__title--empty'}`, [title]);
  const contentClassName = useMemo(() => `dashboard-card__content ${content ? '' : 'dashboard-card__content--empty'}`, [content]);

  return (
    <div className={cardClassName} aria-label={title || 'Dashboard Card'}>
      <h2 className={titleClassName} aria-label={title || 'No Title'}>
        {title || 'No Title'}
      </h2>
      <p className={contentClassName} aria-label={content || 'No Content'}>
        {content || 'No Content'}
      </p>
    </div>
  );
});

export default DashboardCard;