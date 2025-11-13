import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  userID: string;
}

interface ReportData {
  boxContent: string[];
  digitalContent: string[];
  creatorPerformance: number[];
  memberPreferences: string[];
  niche: string;
  month: string;
  year: number;
  error?: string; // Add error property to handle API errors
}

interface EmptyReportData {
  isEmpty: true;
}

const MyComponent: React.FC<Props> = ({ userID }) => {
  const [report, setReport] = useState<ReportData | EmptyReportData>({ isEmpty: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/report/${userID}`);
        setReport(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [userID]);

  // Handle edge cases where report data is empty or incomplete
  if (report.isEmpty) {
    return <div>No report data available for the provided user ID.</div>;
  }

  // Add accessibility improvements by wrapping report data in a table
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report).map(([key, value]) => (
            <tr key={key}>
              <td><strong>{key}</strong></td>
              <td>
                {value.map((item, index) => (
                  <span key={index}>{index > 0 ? ', ' : ''}{item}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div>An error occurred: {error}</div>}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  userID: string;
}

interface ReportData {
  boxContent: string[];
  digitalContent: string[];
  creatorPerformance: number[];
  memberPreferences: string[];
  niche: string;
  month: string;
  year: number;
  error?: string; // Add error property to handle API errors
}

interface EmptyReportData {
  isEmpty: true;
}

const MyComponent: React.FC<Props> = ({ userID }) => {
  const [report, setReport] = useState<ReportData | EmptyReportData>({ isEmpty: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/report/${userID}`);
        setReport(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [userID]);

  // Handle edge cases where report data is empty or incomplete
  if (report.isEmpty) {
    return <div>No report data available for the provided user ID.</div>;
  }

  // Add accessibility improvements by wrapping report data in a table
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report).map(([key, value]) => (
            <tr key={key}>
              <td><strong>{key}</strong></td>
              <td>
                {value.map((item, index) => (
                  <span key={index}>{index > 0 ? ', ' : ''}{item}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div>An error occurred: {error}</div>}
    </div>
  );
};

export default MyComponent;