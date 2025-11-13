import React from 'react';

interface ReportingEngineProps {
  message?: string | React.ReactNode;
  className?: string;
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const ReportingEngine: React.FC<ReportingEngineProps> = ({ message, className, children }) => {
  const finalMessage = message || children;

  return (
    <div className={classNames('reporting-engine', className)} aria-label="Reporting Engine">
      {finalMessage}
    </div>
  );
};

export default ReportingEngine;

import React from 'react';

interface ReportingEngineProps {
  message?: string | React.ReactNode;
  className?: string;
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const ReportingEngine: React.FC<ReportingEngineProps> = ({ message, className, children }) => {
  const finalMessage = message || children;

  return (
    <div className={classNames('reporting-engine', className)} aria-label="Reporting Engine">
      {finalMessage}
    </div>
  );
};

export default ReportingEngine;

<ReportingEngine>Your report is ready.</ReportingEngine>
<ReportingEngine className="custom-class">
  <p>Your report is ready.</p>
</ReportingEngine>

Now you can use the component in various ways, such as:

And the resulting HTML will be: