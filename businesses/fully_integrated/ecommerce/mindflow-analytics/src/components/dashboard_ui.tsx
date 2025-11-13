import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title?: string;
  content?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  content,
  className = 'dashboard-card',
  'aria-label': ariaLabel,
}) => {
  // Ensure that the `className` and `ariaLabel` props are valid
  const validClassName = typeof className === 'string' ? className : '';
  const validAriaLabel = typeof ariaLabel === 'string' ? ariaLabel : '';

  return (
    <div className={validClassName} aria-label={validAriaLabel}>
      {/* Ensure that the `title` prop is a valid string before rendering */}
      {typeof title === 'string' && title.trim().length > 0 && (
        <h2 className="dashboard-card-title">{title}</h2>
      )}
      {/* Ensure that the `content` prop is a valid ReactNode before rendering */}
      {content && (
        <div className="dashboard-card-content">
          {/* Wrap the content in a React.Fragment to avoid unnecessary DOM elements */}
          <>{content}</>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;

import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title?: string;
  content?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  content,
  className = 'dashboard-card',
  'aria-label': ariaLabel,
}) => {
  // Ensure that the `className` and `ariaLabel` props are valid
  const validClassName = typeof className === 'string' ? className : '';
  const validAriaLabel = typeof ariaLabel === 'string' ? ariaLabel : '';

  return (
    <div className={validClassName} aria-label={validAriaLabel}>
      {/* Ensure that the `title` prop is a valid string before rendering */}
      {typeof title === 'string' && title.trim().length > 0 && (
        <h2 className="dashboard-card-title">{title}</h2>
      )}
      {/* Ensure that the `content` prop is a valid ReactNode before rendering */}
      {content && (
        <div className="dashboard-card-content">
          {/* Wrap the content in a React.Fragment to avoid unnecessary DOM elements */}
          <>{content}</>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;