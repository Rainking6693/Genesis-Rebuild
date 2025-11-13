import React, { Key } from 'react';
import { StressLensAnalyticsLogo } from './StressLensAnalyticsLogo';

interface Props {
  title: string;
  subtitle: string;
  burnoutRisk?: number;
  wellnessInterventions?: string[];
}

const DashboardUI: React.FC<Props> = ({ title, subtitle, burnoutRisk = 0, wellnessInterventions = [] }) => {
  // Default burnoutRisk to 0 and wellnessInterventions to an empty array to handle missing or undefined props

  return (
    <div>
      <StressLensAnalyticsLogo />
      <h1 id="dashboard-title">{title}</h1>
      <p id="dashboard-subtitle">{subtitle}</p>
      <ul role="list" aria-labelledby="dashboard-title dashboard-subtitle">
        {wellnessInterventions.length > 0 && (
          <>
            <h3>Recommended Wellness Interventions:</h3>
            <ul role="list">
              {wellnessInterventions.map((intervention, index) => (
                <li key={index as Key}>{intervention}</li>
              ))}
            </ul>
          </>
        )}
      </ul>
    </div>
  );
};

export default DashboardUI;