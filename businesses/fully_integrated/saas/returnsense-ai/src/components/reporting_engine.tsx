import React, { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { ReportingEngineAPI } from '../../api/reporting-engine';

interface Props {
  productId: string;
}

interface ReportData {
  riskScore?: number;
  recommendations?: string[];
  climateImpact?: string;
}

const MyComponent: React.FC<Props> = ({ productId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ReportingEngineAPI.getReport(productId);
        setReportData(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [productId]);

  const formattedRecommendations = useMemo(
    () => reportData?.recommendations?.map((recommendation, index) => (
      <li key={index}>Recommendation {index + 1}: {recommendation}</li>
    )),
    [reportData]
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!reportData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {reportData.riskScore && <div>Risk Score: {reportData.riskScore}</div>}
      {formattedRecommendations}
      {reportData.climateImpact && <div>Climate Impact: {reportData.climateImpact}</div>}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { ReportingEngineAPI } from '../../api/reporting-engine';

interface Props {
  productId: string;
}

interface ReportData {
  riskScore?: number;
  recommendations?: string[];
  climateImpact?: string;
}

const MyComponent: React.FC<Props> = ({ productId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ReportingEngineAPI.getReport(productId);
        setReportData(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [productId]);

  const formattedRecommendations = useMemo(
    () => reportData?.recommendations?.map((recommendation, index) => (
      <li key={index}>Recommendation {index + 1}: {recommendation}</li>
    )),
    [reportData]
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!reportData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {reportData.riskScore && <div>Risk Score: {reportData.riskScore}</div>}
      {formattedRecommendations}
      {reportData.climateImpact && <div>Climate Impact: {reportData.climateImpact}</div>}
    </div>
  );
};

export default MyComponent;