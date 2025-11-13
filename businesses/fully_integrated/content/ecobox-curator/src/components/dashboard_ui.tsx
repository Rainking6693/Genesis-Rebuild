import React, { FunctionComponent, ReactNode } from 'react';
import { PropsWithChildren } from 'react';

interface StatData {
  totalItems?: number;
  savedCO2?: number;
  savedMoney?: number;
}

interface Props extends PropsWithChildren {
  title: string;
  subtitle?: string;
  showStats?: boolean;
  statsData?: StatData;
}

const getStatValue = (stat: keyof Props['statsData']) =>
  props.statsData?.[stat] || 0;

const EcoBoxCuratorDashboard: FunctionComponent<Props> = ({
  title,
  subtitle,
  showStats = false,
  statsData,
  children,
}) => {
  return (
    <div className="ecobox-curator-dashboard" aria-label="EcoBox Curator Dashboard">
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {showStats && (
        <div className="ecobox-curator-stats">
          <p>Total Items: {getStatValue('totalItems')}</p>
          <p>Saved CO2: {getStatValue('savedCO2')} kg</p>
          <p>Saved Money: ${getStatValue('savedMoney')}</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default EcoBoxCuratorDashboard;

In this code:

1. `ReactNode` is added to the `children` prop to make it more flexible and accept any valid React child.
2. `aria-label` is added to the root `div` for better accessibility.
3. `statsData` is made optional by using optional chaining (`?.`) and added default values for each statistic in case they are not provided.
4. A helper function `getStatValue` is created to simplify the rendering of statistics and make the code more readable.
5. TypeScript's optional properties syntax is used to make the props interface more explicit and easier to understand.