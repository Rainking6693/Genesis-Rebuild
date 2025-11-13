import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CarbonImpactReport, MarketingAutomation } from 'your-libraries';

interface FunctionalComponentProps {
  message: string;
}

const FunctionalComponent: FC<FunctionalComponentProps> = ({ message }) => {
  return <div aria-label="Generated content">{React.createElement('div', null, message)}</div>;
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export interface ClimatePitchProps {
  businessData: any;
}

export interface ClimatePitchState {
  message: string;
  error: Error | null;
}

export default function ClimatePitch(props: ClimatePitchProps) {
  const [state, setState] = useState<ClimatePitchState>({ message: '', error: null });
  const carbonImpactReport = new CarbonImpactReport();
  const marketingAutomation = new MarketingAutomation();

  useEffect(() => {
    generateContent();
  }, []);

  const generateContent = async () => {
    let businessData = props.businessData;

    if (!businessData) {
      businessData = await fetchBusinessData();
    }

    if (!businessData) {
      setState({ message: 'Error fetching business data.', error: new Error('Error fetching business data') });
      return;
    }

    try {
      const carbonImpactReportData = await carbonImpactReport.generateReport(businessData);
      const content = marketingAutomation.generateContent(carbonImpactReportData);
      setState({ message: content, error: null });
    } catch (error) {
      setState({ message: `Error generating content: ${error.message}`, error });
    }
  };

  const fetchBusinessData = async () => {
    try {
      const response = await fetch('your-secure-api-url');
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      setState({ message: `Error fetching business data: ${error.message}`, error });
      return null;
    }
  };

  return <FunctionalComponent message={state.message} />;
}

This updated code addresses the issues mentioned and provides a more maintainable, accessible, and resilient solution for the content business specification component.