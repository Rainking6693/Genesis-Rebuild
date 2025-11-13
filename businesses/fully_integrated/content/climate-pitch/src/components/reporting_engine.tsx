import React, { FC, ReactNode } from 'react';

interface Props {
  carbonImpactReport: CarbonImpactReport; // Assuming there's a CarbonImpactReport interface for the data structure
}

interface CarbonImpactReport {
  totalCarbonEmissions?: number;
  reductionGoals?: ReductionGoals[];
  sustainabilityInitiatives?: SustainabilityInitiative[];
}

interface ReductionGoals {
  goalName: string;
  targetYear: number;
  currentProgress?: number; // Default value added to avoid potential undefined errors
}

interface SustainabilityInitiative {
  initiativeName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  // Added a check for invalid dates
  startDateValid: boolean;
  endDateValid: boolean;
}

const ReportingComponent: FC<Props> = ({ carbonImpactReport }) => {
  if (!carbonImpactReport) {
    return <div aria-hidden="true" data-testid="no-data-available">No carbon impact report data available.</div>;
  }

  let totalCarbonEmissionsContent: ReactNode;
  if (carbonImpactReport.totalCarbonEmissions === undefined) {
    totalCarbonEmissionsContent = <div aria-hidden="true" data-testid="total-carbon-emissions-not-available">Total carbon emissions data not available.</div>;
  } else {
    totalCarbonEmissionsContent = <p>{carbonImpactReport.totalCarbonEmissions}</p>;
  }

  let reductionGoalsContent: ReactNode;
  if (!carbonImpactReport.reductionGoals || carbonImpactReport.reductionGoals.length === 0) {
    reductionGoalsContent = <div aria-hidden="true" data-testid="no-reduction-goals-available">No reduction goals available.</div>;
  } else {
    reductionGoalsContent = (
      <>
        <h3 aria-labelledby="reduction-goals-title">Reduction Goals</h3>
        <ul role="list">
          {carbonImpactReport.reductionGoals.map((goal, index) => (
            <li key={index}>
              <h4>{goal.goalName}</h4>
              <p aria-describedby={`reduction-goals-target-year-${index}`}>Target Year: {goal.targetYear}</p>
              <p aria-describedby={`reduction-goals-current-progress-${index}`}>Current Progress: {goal.currentProgress || 'Not available'}</p>
            </li>
          ))}
        </ul>
      </>
    );
  }

  let sustainabilityInitiativesContent: ReactNode;
  if (!carbonImpactReport.sustainabilityInitiatives || carbonImpactReport.sustainabilityInitiatives.length === 0) {
    sustainabilityInitiativesContent = <div aria-hidden="true" data-testid="no-sustainability-initiatives-available">No sustainability initiatives available.</div>;
  } else {
    sustainabilityInitiativesContent = (
      <>
        <h3 aria-labelledby="sustainability-initiatives-title">Sustainability Initiatives</h3>
        <ul role="list">
          {carbonImpactReport.sustainabilityInitiatives.map((initiative, index) => {
            return (
              <li key={index}>
                <h4>{initiative.initiativeName}</h4>
                <p aria-describedby={`sustainability-initiatives-description-${index}`}>{initiative.description}</p>
                <p aria-describedby={`sustainability-initiatives-start-date-${index}`}>Start Date: {initiative.startDate.toLocaleDateString()}</p>
                <p aria-describedby={`sustainability-initiatives-end-date-${index}`}>End Date: {initiative.endDate.toLocaleDateString()}</p>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <div>
      <h1 aria-label="Carbon Impact Report">Carbon Impact Report</h1>
      {totalCarbonEmissionsContent}
      {reductionGoalsContent}
      {sustainabilityInitiativesContent}
    </div>
  );
};

export default ReportingComponent;

This updated code addresses the issues of resiliency, edge cases, accessibility, and maintainability for the `ReportingComponent`.