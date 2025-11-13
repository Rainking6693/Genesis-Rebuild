import React, { memo, useMemo } from 'react';

interface DashboardComponentProps {
  title?: string;
  content?: string;
}

const DashboardComponent: React.FC<DashboardComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Dashboard Component', [title]);
  const safeContent = useMemo(() => content || 'No content available.', [content]);

  return (
    <div
      className="dashboard-component"
      aria-label="Dashboard Component"
      data-testid="dashboard-component"
    >
      <h1 className="dashboard-title" aria-label="Dashboard Title" data-testid="dashboard-title">
        {safeTitle}
      </h1>
      <p
        className="dashboard-content"
        aria-label="Dashboard Content"
        data-testid="dashboard-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

DashboardComponent.displayName = 'DashboardComponent';

export default DashboardComponent;

import React, { memo, useMemo } from 'react';

interface DashboardComponentProps {
  title?: string;
  content?: string;
}

const DashboardComponent: React.FC<DashboardComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Dashboard Component', [title]);
  const safeContent = useMemo(() => content || 'No content available.', [content]);

  return (
    <div
      className="dashboard-component"
      aria-label="Dashboard Component"
      data-testid="dashboard-component"
    >
      <h1 className="dashboard-title" aria-label="Dashboard Title" data-testid="dashboard-title">
        {safeTitle}
      </h1>
      <p
        className="dashboard-content"
        aria-label="Dashboard Content"
        data-testid="dashboard-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

DashboardComponent.displayName = 'DashboardComponent';

export default DashboardComponent;