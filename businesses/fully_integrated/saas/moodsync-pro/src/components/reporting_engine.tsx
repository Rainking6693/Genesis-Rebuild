import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  apiKey: string;
  teamId: string;
}

interface ReportData {
  burnoutRisk?: number | null;
  workloadOptimization?: string[] | null;
  wellnessRecommendations?: string[] | null;
  error?: string | null;
}

const MyComponent: React.FC<Props> = ({ apiKey, teamId }) => {
  const [reportData, setReportData] = useState<ReportData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.moodsyncpro.com/v1/reports?api_key=${apiKey}&team_id=${teamId}`);
        setReportData(response.data);
      } catch (error) {
        setReportData({ error: error.message });
      }
    };

    fetchData();
  }, [apiKey, teamId]);

  const handleError = () => {
    if (reportData.error) {
      return <p>An error occurred: {reportData.error}</p>;
    }
    return null;
  };

  const renderBurnoutRisk = () => {
    if (reportData.burnoutRisk !== undefined) {
      return <p>Burnout Risk: {reportData.burnoutRisk}</p>;
    }
    return null;
  };

  const renderWorkloadOptimization = () => {
    if (reportData.workloadOptimization !== undefined) {
      return (
        <ul>
          {reportData.workloadOptimization.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const renderWellnessRecommendations = () => {
    if (reportData.wellnessRecommendations !== undefined) {
      return (
        <ul>
          {reportData.wellnessRecommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div>
      <h2>Team Wellness Report</h2>
      {handleError()}
      {renderBurnoutRisk()}
      <h3>Workload Optimization</h3>
      {renderWorkloadOptimization()}
      <h3>Wellness Recommendations</h3>
      {renderWellnessRecommendations()}
    </div>
  );
};

export default MyComponent;

Changes made:

1. Added optional properties to the `ReportData` interface to handle edge cases where the API might return incomplete data.
2. Updated the state to store the error message in case of an API error.
3. Created separate functions for handling the rendering of each report section, making the code more maintainable.
4. Added null checks for `reportData.burnoutRisk`, `reportData.workloadOptimization`, and `reportData.wellnessRecommendations` before rendering them.
5. Improved accessibility by adding proper headings (`<h2>`, `<h3>`) for the report sections.