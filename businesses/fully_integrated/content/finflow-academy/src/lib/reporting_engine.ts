import React, { FC, ReactNode, PropsWithChildren } from 'react';

type ReportMessage = string;

interface ReportComponentProps extends PropsWithChildren<{ message: ReportMessage; isFinancialReport?: boolean }> {}

const ReportComponent: FC<ReportComponentProps> = ({ children, isFinancialReport = false }) => {
  const reportClass = isFinancialReport ? 'financial-report' : 'standard-report';

  return (
    <div className={reportClass}>
      <div className="report-header">Report</div>
      <div className="report-content">{children}</div>
    </div>
  );
};

ReportComponent.defaultProps = {
  isFinancialReport: false,
};

const FinancialReportComponent: FC<ReportComponentProps> = ({ message, ...props }) => {
  return (
    <ReportComponent {...props}>
      <div className="financial-report-additional-info">Additional Financial Information</div>
      {message && <div className="report-content">{message}</div>}
    </ReportComponent>
  );
};

export { ReportComponent, FinancialReportComponent };

import React, { FC, ReactNode, PropsWithChildren } from 'react';

type ReportMessage = string;

interface ReportComponentProps extends PropsWithChildren<{ message: ReportMessage; isFinancialReport?: boolean }> {}

const ReportComponent: FC<ReportComponentProps> = ({ children, isFinancialReport = false }) => {
  const reportClass = isFinancialReport ? 'financial-report' : 'standard-report';

  return (
    <div className={reportClass}>
      <div className="report-header">Report</div>
      <div className="report-content">{children}</div>
    </div>
  );
};

ReportComponent.defaultProps = {
  isFinancialReport: false,
};

const FinancialReportComponent: FC<ReportComponentProps> = ({ message, ...props }) => {
  return (
    <ReportComponent {...props}>
      <div className="financial-report-additional-info">Additional Financial Information</div>
      {message && <div className="report-content">{message}</div>}
    </ReportComponent>
  );
};

export { ReportComponent, FinancialReportComponent };