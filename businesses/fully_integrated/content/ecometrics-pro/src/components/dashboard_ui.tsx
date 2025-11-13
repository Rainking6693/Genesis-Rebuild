import React, { FC, ReactNode, Key } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  title: string;
  subtitle?: string;
  dataPoints: DataPoint[];
}

const DashboardUI: FC<Props> = ({ title, subtitle = '', dataPoints }) => {
  return (
    <div data-testid="dashboard-ui" tabIndex={0} role="region" aria-labelledby="dashboard-title dashboard-subtitle" style={{ minWidth: '300px', padding: '1rem' }}>
      <h1 id="dashboard-title" role="heading" aria-level={1}>{title}</h1>
      {subtitle && <h2 id="dashboard-subtitle" role="heading" aria-level={2}>{subtitle}</h2>}
      <ul style={{ display: 'block', border: '1px solid #ccc', padding: '0' }}>
        {dataPoints.map((point, index: Key) => (
          <li key={index} className="data-point" style={{ minWidth: '300px', padding: '0.5rem 0' }}>
            {point.label}: {point.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardUI;

This updated version addresses the initial requirements and adds additional improvements for accessibility, resiliency, and maintainability.