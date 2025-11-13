import React from 'react';

interface DashboardCardProps {
  title?: string;
  content?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, content }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {title && (
        <h2
          className="text-2xl font-bold mb-4"
          aria-label={title}
          data-testid="dashboard-card-title"
        >
          {title}
        </h2>
      )}
      {content && (
        <p
          className="text-gray-700"
          aria-label={content}
          data-testid="dashboard-card-content"
        >
          {content}
        </p>
      )}
      {!title && !content && (
        <div
          className="text-center text-gray-500"
          data-testid="dashboard-card-no-data"
        >
          No data available for this card.
        </div>
      )}
    </div>
  );
};

export default DashboardCard;

import React from 'react';

interface DashboardCardProps {
  title?: string;
  content?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, content }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {title && (
        <h2
          className="text-2xl font-bold mb-4"
          aria-label={title}
          data-testid="dashboard-card-title"
        >
          {title}
        </h2>
      )}
      {content && (
        <p
          className="text-gray-700"
          aria-label={content}
          data-testid="dashboard-card-content"
        >
          {content}
        </p>
      )}
      {!title && !content && (
        <div
          className="text-center text-gray-500"
          data-testid="dashboard-card-no-data"
        >
          No data available for this card.
        </div>
      )}
    </div>
  );
};

export default DashboardCard;