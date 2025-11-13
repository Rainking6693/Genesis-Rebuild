import React, { FC, ReactNode, Dispatch, SetStateAction } from 'react';

interface Props {
  message?: string;
  onError?: Dispatch<SetStateAction<string>>; // Add an optional onError callback for custom error handling
}

interface CalculationResult {
  success: boolean;
  data?: any;
  error?: Error;
}

const calculateCarbonFootprintOrCheckESGCompliance = (): CalculationResult => {
  // Perform carbon footprint calculation or ESG compliance checks
  // ...

  // Handle edge cases and return a structured result
  if (/* calculation or check was successful */) {
    return { success: true, data: /* calculated data */ };
  } else {
    return { success: false, error: new Error('Calculation or check failed') };
  }
};

const generateReport = (calculatedData: any): ReactNode => {
  // Generate personalized report based on calculated data
  // ...
};

const ReportingEngine: FC<Props> = ({ message, onError }) => {
  const [calculationResult, setCalculationResult] = React.useState<CalculationResult>({ success: false });

  React.useEffect(() => {
    const handleCalculation = async () => {
      const result = calculateCarbonFootprintOrCheckESGCompliance();
      setCalculationResult(result);

      if (!result.success && onError) {
        onError('An error occurred while generating the report. Please try again later.');
      }
    };

    handleCalculation();
  }, [onError]);

  if (calculationResult.success) {
    const report = generateReport(calculationResult.data);

    // Render the report
    return (
      <div data-testid="report" role="alert" aria-live="polite" aria-label="Report" aria-labelledby="report-title" id="report-title">
        {report}
      </div>
    );
  } else {
    // Return an error message to the user
    return (
      <div data-testid="error" role="alert" aria-live="assertive" aria-label="Error" aria-labelledby="error-title" id="error-title">
        {calculationResult.error?.message || 'An error occurred while generating the report. Please try again later.'}
      </div>
    );
  }
};

// Extract common import statement for better organization and maintainability
import React from 'react';

export { ReportingEngine };

In this updated code, I've added an optional `onError` prop to allow custom error handling. I've also separated the calculation logic into a separate function that returns a structured result, making it easier to handle edge cases. Additionally, I've used a `useEffect` hook to perform the calculation on mount and whenever the `onError` prop changes. This ensures that the calculation is only performed when necessary and that any errors are properly handled and passed to the provided callback. Lastly, I've updated the error message to include the error message from the calculation result if available.