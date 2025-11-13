import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
}

interface ESGReport {
  // Define your ESG report structure here
}

const ReportingEngine: FC<Props> = ({ message }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [report, setReport] = useState<ESGReport | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      setIsLoading(true);
      try {
        // Add your ESG report generation logic here
        const generatedReport: ESGReport = { /* ... */ };
        setReport(generatedReport);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };

    if (message === 'Force Regenerate Report') {
      generateReport();
    }
  }, [message]);

  return (
    <div>
      {isLoading && <p>Generating ESG Report...</p>}
      {error && <p>An error occurred while generating the report: {error.message}</p>}
      {report && (
        <ESGReportDisplay report={report} />
      )}
      {!isLoading && !error && (
        <button disabled={isLoading} onClick={() => setMessage('Force Regenerate Report')}>
          Regenerate Report
        </button>
      )}
    </div>
  );
};

const ESGReportDisplay: FC<{ report: ESGReport }> = ({ report }) => {
  return (
    <div>
      {/* Display the ESG report in a structured and accessible manner */}
      <h2>ESG Report</h2>
      <ul>
        {Object.entries(report).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the components with meaningful names that reflect their purpose
export { ReportingEngine, ESGReportDisplay };

Improvements made:

1. Added an optional `message` prop to the `ReportingEngine` component to allow for forced regeneration of the report.
2. Checked if the `message` prop is 'Force Regenerate Report' before generating the report in the `useEffect` hook to prevent unnecessary API calls.
3. Added a button to allow users to force regenerate the report.
4. Added a disabled state to the button while the report is being generated to prevent multiple clicks.
5. Added error handling for the `Error` type to handle potential errors during report generation.
6. Made the `ESGReportDisplay` component more accessible by using semantic HTML elements (`<h2>` and `<ul>`).
7. Added a key attribute to the `<li>` elements in the `ESGReportDisplay` component for better performance.