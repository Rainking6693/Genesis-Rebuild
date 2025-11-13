import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
  subtitle: string;
  carbonData: CarbonData;
  actions: Action[];
  spaceBetweenActions?: number;
}

interface CarbonData {
  footprint: number;
  savings: number;
  incentives: number;
}

interface Action {
  label: string;
  onClick: () => void;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  carbonData,
  actions,
  spaceBetweenActions = 10,
  children,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.click();
    }
  };

  if (!title || !subtitle || !carbonData || !actions.length) {
    return null;
  }

  return (
    <div role="region" aria-labelledby="dashboard-title dashboard-subtitle" className="dashboard-ui" data-testid="dashboard-ui">
      <h1 id="dashboard-title" tabIndex={-1}>
        {title}
      </h1>
      <h2 id="dashboard-subtitle" tabIndex={-1}>
        {subtitle}
      </h2>
      <div>
        <p>
          Carbon Footprint: <strong>{carbonData.footprint} tons</strong>
        </p>
        <p>
          Estimated Savings: <strong>{carbonData.savings} tons</strong>
        </p>
        <p>
          Green Incentives: <strong>{carbonData.incentives} $</strong>
        </p>
      </div>
      {children}
      {actions.map((action, index) => (
        <button
          key={index}
          type="button"
          onClick={action.onClick}
          onKeyDown={handleKeyDown}
          style={{ marginRight: index === actions.length - 1 ? 0 : ` ${spaceBetweenActions}px` }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardUI;

This updated code includes the suggested improvements and adds a `spaceBetweenActions` prop for custom spacing between actions. The `children` prop is used to render any additional content within the actions section, allowing for more flexibility in the component's usage.