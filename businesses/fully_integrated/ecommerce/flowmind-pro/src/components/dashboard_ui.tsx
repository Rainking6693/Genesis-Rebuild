import React, { memo, useMemo } from 'react';

interface DashboardCardProps {
  title?: string;
  content?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div className="dashboard-card" aria-label={safeTitle}>
      <h2 className="dashboard-card__title" id="dashboard-card-title">
        {safeTitle}
      </h2>
      <p className="dashboard-card__content" aria-describedby="dashboard-card-title">
        {safeContent}
      </p>
    </div>
  );
});

export default DashboardCard;

import React, { memo, useMemo } from 'react';

interface DashboardCardProps {
  title?: string;
  content?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div className="dashboard-card" aria-label={safeTitle}>
      <h2 className="dashboard-card__title" id="dashboard-card-title">
        {safeTitle}
      </h2>
      <p className="dashboard-card__content" aria-describedby="dashboard-card-title">
        {safeContent}
      </p>
    </div>
  );
});

export default DashboardCard;