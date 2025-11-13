import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  apiKey: string;
  creatorId: string;
}

interface ReportData {
  contentFormat: string;
  views: number;
  engagement: number;
  carbonFootprint: number;
  revenue: number;
  error?: string; // Add error property to handle API errors
}

const MyComponent: React.FC<Props> = ({ apiKey, creatorId }) => {
  const [report, setReport] = useState<ReportData>({
    contentFormat: '',
    views: 0,
    engagement: 0,
    carbonFootprint: 0,
    revenue: 0,
    error: '', // Initialize error state
    isLoading: true, // Add loading state
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`https://api.ecocreatorhub.com/reports/${creatorId}`, {
          headers: {
            'Api-Key': apiKey,
          },
        });

        setReport({
          ...report,
          ...response.data,
          error: '',
          isLoading: false, // Set loading state to false when data is fetched
        });
      } catch (error) {
        setReport({ ...report, error: 'An error occurred while fetching the report.' }); // Update error state
      }
    };

    fetchReport();
  }, [apiKey, creatorId]);

  // Add accessibility improvements by adding aria-labels to the report data
  return (
    <div>
      <h2 aria-label="Report for Creator ID">Report for Creator ID: {creatorId}</h2>
      {report.isLoading ? <p>Loading report...</p> : (
        <>
          <ul key={report.contentFormat}>
            <li aria-label="Content Format">Content Format: {report.contentFormat}</li>
            <li aria-label="Views">Views: {report.views}</li>
            <li aria-label="Engagement">Engagement: {report.engagement}</li>
            <li aria-label="Carbon Footprint">Carbon Footprint: {report.carbonFootprint} kg CO2</li>
            <li aria-label="Revenue">Revenue: ${report.revenue}</li>
          </ul>
          {report.error && <p data-testid="error-message" aria-label="Error Message">Error Message: {report.error}</p>} // Display error message if available
        </>
      )}
    </div>
  );
};

export default MyComponent;

This updated version of the `reporting_engine` component now includes a loading state, improved error handling, and better accessibility. Additionally, it provides a more user-friendly error message and adds a `data-testid` attribute for easier testing.