import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props {
  title: string;
  carbonFootprint?: number;
  carbonFootprintLabel?: string;
  complianceReportUrl?: string;
  complianceReportLabel?: string;
  sustainabilityCertificateUrl?: string;
  sustainabilityCertificateLabel?: string;
  transactionId?: string;
  transactionIdLabel?: string;
}

const DashboardUI: FC<PropsWithChildren<Props>> = ({
  title,
  carbonFootprint = 0,
  carbonFootprintLabel = 'Carbon Footprint',
  complianceReportUrl,
  complianceReportLabel = 'Compliance Report',
  sustainabilityCertificateUrl,
  sustainabilityCertificateLabel = 'Sustainability Certificate',
  transactionId,
  transactionIdLabel = 'Transaction ID',
  children,
}) => {
  const getFootprintLabel = (footprint: number) => `${footprint} kg CO2e`;

  return (
    <div>
      <h1>{title}</h1>
      <div>{transactionIdLabel}: {transactionId || '-'}</div>
      <div>{carbonFootprintLabel}: {carbonFootprint > 0 ? getFootprintLabel(carbonFootprint) : '-'}</div>
      {complianceReportUrl && (
        <div>
          <a href={complianceReportUrl} target="_blank" rel="noopener noreferrer">
            {complianceReportLabel}
          </a>
        </div>
      )}
      {sustainabilityCertificateUrl && (
        <div>
          <a href={sustainabilityCertificateUrl} target="_blank" rel="noopener noreferrer">
            {sustainabilityCertificateLabel}
          </a>
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardUI;

import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props {
  title: string;
  carbonFootprint?: number;
  carbonFootprintLabel?: string;
  complianceReportUrl?: string;
  complianceReportLabel?: string;
  sustainabilityCertificateUrl?: string;
  sustainabilityCertificateLabel?: string;
  transactionId?: string;
  transactionIdLabel?: string;
}

const DashboardUI: FC<PropsWithChildren<Props>> = ({
  title,
  carbonFootprint = 0,
  carbonFootprintLabel = 'Carbon Footprint',
  complianceReportUrl,
  complianceReportLabel = 'Compliance Report',
  sustainabilityCertificateUrl,
  sustainabilityCertificateLabel = 'Sustainability Certificate',
  transactionId,
  transactionIdLabel = 'Transaction ID',
  children,
}) => {
  const getFootprintLabel = (footprint: number) => `${footprint} kg CO2e`;

  return (
    <div>
      <h1>{title}</h1>
      <div>{transactionIdLabel}: {transactionId || '-'}</div>
      <div>{carbonFootprintLabel}: {carbonFootprint > 0 ? getFootprintLabel(carbonFootprint) : '-'}</div>
      {complianceReportUrl && (
        <div>
          <a href={complianceReportUrl} target="_blank" rel="noopener noreferrer">
            {complianceReportLabel}
          </a>
        </div>
      )}
      {sustainabilityCertificateUrl && (
        <div>
          <a href={sustainabilityCertificateUrl} target="_blank" rel="noopener noreferrer">
            {sustainabilityCertificateLabel}
          </a>
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardUI;