import React, { FC, ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

interface DashboardCardProps {
  title: string;
  content?: ReactNode;
  error?: boolean;
  loading?: boolean;
  className?: string;
  titleId?: string;
  ariaLabel?: string;
}

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  content = 'No content available.',
  error = false,
  loading = false,
  className = '',
  titleId,
  ariaLabel,
}) => {
  const [isLoading, setIsLoading] = useState(loading);
  const [hasError, setHasError] = useState(error);
  const [cardContent, setCardContent] = useState<ReactNode>(content);

  useEffect(() => {
    setIsLoading(loading);
    setHasError(error);
    setCardContent(content);
  }, [loading, error, content]);

  const cardClassName = `dashboard-card ${className} ${hasError ? 'dashboard-card--error' : ''} ${isLoading ? 'dashboard-card--loading' : ''}`;

  return (
    <div className={cardClassName} aria-label={ariaLabel}>
      <h2 className="dashboard-card-title" id={titleId}>
        {title || 'Untitled Card'}
      </h2>
      {isLoading ? (
        <div className="dashboard-card-loading-indicator">Loading...</div>
      ) : hasError ? (
        <div className="dashboard-card-error-message">Error loading content. Please try again.</div>
      ) : (
        <div className="dashboard-card-content" aria-labelledby={titleId}>
          {cardContent}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  titleId: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default DashboardCard;

import React, { FC, ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

interface DashboardCardProps {
  title: string;
  content?: ReactNode;
  error?: boolean;
  loading?: boolean;
  className?: string;
  titleId?: string;
  ariaLabel?: string;
}

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  content = 'No content available.',
  error = false,
  loading = false,
  className = '',
  titleId,
  ariaLabel,
}) => {
  const [isLoading, setIsLoading] = useState(loading);
  const [hasError, setHasError] = useState(error);
  const [cardContent, setCardContent] = useState<ReactNode>(content);

  useEffect(() => {
    setIsLoading(loading);
    setHasError(error);
    setCardContent(content);
  }, [loading, error, content]);

  const cardClassName = `dashboard-card ${className} ${hasError ? 'dashboard-card--error' : ''} ${isLoading ? 'dashboard-card--loading' : ''}`;

  return (
    <div className={cardClassName} aria-label={ariaLabel}>
      <h2 className="dashboard-card-title" id={titleId}>
        {title || 'Untitled Card'}
      </h2>
      {isLoading ? (
        <div className="dashboard-card-loading-indicator">Loading...</div>
      ) : hasError ? (
        <div className="dashboard-card-error-message">Error loading content. Please try again.</div>
      ) : (
        <div className="dashboard-card-content" aria-labelledby={titleId}>
          {cardContent}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  titleId: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default DashboardCard;