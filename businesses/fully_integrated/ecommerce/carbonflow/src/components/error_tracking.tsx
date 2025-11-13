import React, { memo, useMemo } from 'react';

interface EmissionsData {
  carbonFootprint?: number;
  suggestedActions?: string[];
}

interface EmissionsTrackingComponentProps {
  emissionsData?: EmissionsData;
}

const EmissionsTrackingComponent: React.FC<EmissionsTrackingComponentProps> = memo(
  ({ emissionsData = { carbonFootprint: 0, suggestedActions: [] } }) => {
    const { carbonFootprint, suggestedActions } = emissionsData;

    const formattedCarbonFootprint = useMemo(() => {
      return typeof carbonFootprint === 'number'
        ? `${carbonFootprint.toFixed(2)} kg CO2e`
        : 'N/A';
    }, [carbonFootprint]);

    return (
      <div className="emissions-tracking-component">
        <h1 className="emissions-tracking-component__title">
          Your Carbon Footprint
        </h1>
        <p
          className="emissions-tracking-component__carbon-footprint"
          aria-label={`Your carbon footprint is ${formattedCarbonFootprint}`}
        >
          {formattedCarbonFootprint}
        </p>
        {suggestedActions?.length > 0 && (
          <>
            <h2 className="emissions-tracking-component__subtitle">
              Suggested Actions:
            </h2>
            <ul className="emissions-tracking-component__actions-list">
              {suggestedActions.map((action, index) => (
                <li
                  key={index}
                  className="emissions-tracking-component__actions-list-item"
                  aria-label={`Suggested action ${index + 1}: ${action}`}
                >
                  {action}
                </li>
              ))}
            </ul>
          </>
        )}
        {suggestedActions?.length === 0 && (
          <p className="emissions-tracking-component__no-actions">
            No suggested actions available.
          </p>
        )}
      </div>
    );
  }
);

export default EmissionsTrackingComponent;

import React, { memo, useMemo } from 'react';

interface EmissionsData {
  carbonFootprint?: number;
  suggestedActions?: string[];
}

interface EmissionsTrackingComponentProps {
  emissionsData?: EmissionsData;
}

const EmissionsTrackingComponent: React.FC<EmissionsTrackingComponentProps> = memo(
  ({ emissionsData = { carbonFootprint: 0, suggestedActions: [] } }) => {
    const { carbonFootprint, suggestedActions } = emissionsData;

    const formattedCarbonFootprint = useMemo(() => {
      return typeof carbonFootprint === 'number'
        ? `${carbonFootprint.toFixed(2)} kg CO2e`
        : 'N/A';
    }, [carbonFootprint]);

    return (
      <div className="emissions-tracking-component">
        <h1 className="emissions-tracking-component__title">
          Your Carbon Footprint
        </h1>
        <p
          className="emissions-tracking-component__carbon-footprint"
          aria-label={`Your carbon footprint is ${formattedCarbonFootprint}`}
        >
          {formattedCarbonFootprint}
        </p>
        {suggestedActions?.length > 0 && (
          <>
            <h2 className="emissions-tracking-component__subtitle">
              Suggested Actions:
            </h2>
            <ul className="emissions-tracking-component__actions-list">
              {suggestedActions.map((action, index) => (
                <li
                  key={index}
                  className="emissions-tracking-component__actions-list-item"
                  aria-label={`Suggested action ${index + 1}: ${action}`}
                >
                  {action}
                </li>
              ))}
            </ul>
          </>
        )}
        {suggestedActions?.length === 0 && (
          <p className="emissions-tracking-component__no-actions">
            No suggested actions available.
          </p>
        )}
      </div>
    );
  }
);

export default EmissionsTrackingComponent;