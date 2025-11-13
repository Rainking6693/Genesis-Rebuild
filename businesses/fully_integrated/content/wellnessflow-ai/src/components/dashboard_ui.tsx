import React, { FC, ReactNode, Key } from 'react';

interface Props {
  title: string;
  subtitle: string;
  data: {
    dailyContent: string[];
    teamChallenges: string[];
    roiTracking: string[];
  };
}

const DashboardUI: FC<Props> = ({ title, subtitle, data }) => {
  const renderListItem = (items: string[], listId: string): ReactNode => (
    <div data-testid={listId} role="list" aria-label={`${listId} list`} key={listId}>
      {items.map((item, index) => (
        <div key={index} role="listitem">{item}</div>
      ))}
    </div>
  );

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      {renderListItem(data.dailyContent, 'daily-content-list')}
      {renderListItem(data.teamChallenges, 'team-challenges-list')}
      {renderListItem(data.roiTracking, 'roi-tracking-list')}
    </div>
  );
};

export default DashboardUI;

import React, { FC, ReactNode, Key } from 'react';

interface Props {
  title: string;
  subtitle: string;
  data: {
    dailyContent: string[];
    teamChallenges: string[];
    roiTracking: string[];
  };
}

const DashboardUI: FC<Props> = ({ title, subtitle, data }) => {
  const renderListItem = (items: string[], listId: string): ReactNode => (
    <div data-testid={listId} role="list" aria-label={`${listId} list`} key={listId}>
      {items.map((item, index) => (
        <div key={index} role="listitem">{item}</div>
      ))}
    </div>
  );

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      {renderListItem(data.dailyContent, 'daily-content-list')}
      {renderListItem(data.teamChallenges, 'team-challenges-list')}
      {renderListItem(data.roiTracking, 'roi-tracking-list')}
    </div>
  );
};

export default DashboardUI;