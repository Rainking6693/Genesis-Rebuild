import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  churnRisk?: number;
  campaignStatus?: string;
  customerName?: string;
  customerEmail?: string;
  campaignMetrics?: {
    openRate?: number;
    clickRate?: number;
    conversionRate?: number;
  };
  children?: ReactNode;
}

const DashboardUI: FC<Props> = ({
  title,
  subtitle,
  churnRisk = 0,
  campaignStatus = '',
  customerName = '',
  customerEmail = '',
  campaignMetrics = { openRate: 0, clickRate: 0, conversionRate: 0 },
  children,
}) => {
  return (
    <div className="dashboard-ui">
      <h1>{title}</h1>
      {subtitle && <p aria-label="Subtitle">{subtitle}</p>}
      <div>
        <strong aria-label="Churn Risk">Churn Risk:</strong> {churnRisk}%
      </div>
      <div>
        <strong aria-label="Campaign Status">Campaign Status:</strong> {campaignStatus}
      </div>
      <div>
        <strong aria-label="Customer">Customer:</strong> {customerName} ({customerEmail})
      </div>
      <div>
        <strong aria-label="Campaign Metrics">Campaign Metrics:</strong>
        <ul>
          <li>
            <span aria-label="Open Rate">Open Rate:</span> {campaignMetrics.openRate}%
          </li>
          <li>
            <span aria-label="Click Rate">Click Rate:</span> {campaignMetrics.clickRate}%
          </li>
          <li>
            <span aria-label="Conversion Rate">Conversion Rate:</span> {campaignMetrics.conversionRate}%
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
};

export default DashboardUI;

In this updated version, I've added type definitions for all properties, checked for undefined values, added ARIA labels for accessibility, and added a CSS class for styling and maintainability. This should help improve the resiliency, edge cases, accessibility, and maintainability of the `DashboardUI` component.