import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  stats?: {
    activeSubscriptions?: number;
    totalProductsCurated?: number;
    communityMembers?: number;
  };
}

const defaultStats: Props['stats'] = {
  activeSubscriptions: undefined,
  totalProductsCurated: undefined,
  communityMembers: undefined,
};

const DashboardUI: FC<Props> = ({ title, subtitle, stats = defaultStats }) => {
  const getStatValue = (stat: keyof Props['stats']) => {
    const value = stats[stat];
    if (value === undefined || value === null) {
      return <em className="visually-hidden">Not available</em>;
    }
    return value;
  };

  return (
    <div className="dashboard-ui">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div>
        <strong>Active Subscriptions:</strong> {getStatValue('activeSubscriptions')}
      </div>
      <div>
        <strong>Total Products Curated:</strong> {getStatValue('totalProductsCurated')}
      </div>
      <div>
        <strong>Community Members:</strong> {getStatValue('communityMembers')}
      </div>
    </div>
  );
};

export default DashboardUI;

1. Made the `stats` prop optional and provided a default value to avoid potential errors when the props are missing.
2. Added type annotations to the `defaultStats` object for better type safety.
3. Used the `defaultStats` object when the `stats` prop is not provided.
4. Improved the accessibility by adding the `visually-hidden` class to the fallback message for screen readers.
5. Made the code more maintainable by using a single `getStatValue` function for all statistics.
6. Removed the duplicated `DashboardUI` import at the bottom of the file.