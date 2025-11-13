import React, { FC, ReactNode } from 'react';

type CarbonFootprint = number;
type OffsetCost = number;
type GreenMarketingCampaigns = number;

interface Props {
  title: string;
  subtitle?: string;
  carbonFootprint: CarbonFootprint;
  offsetCost: OffsetCost;
  greenMarketingCampaigns: GreenMarketingCampaigns;
  children?: ReactNode;
}

const validateProps = (props: Props): void => {
  const { carbonFootprint, offsetCost, greenMarketingCampaigns } = props;

  if (typeof carbonFootprint !== 'number' || carbonFootprint < 0) {
    throw new Error('Invalid carbonFootprint prop');
  }

  if (typeof offsetCost !== 'number' || offsetCost < 0) {
    throw new Error('Invalid offsetCost prop');
  }

  if (typeof greenMarketingCampaigns !== 'number' || greenMarketingCampaigns < 0) {
    throw new Error('Invalid greenMarketingCampaigns prop');
  }
};

const DashboardUI: FC<Props> = ({ title, subtitle = '', carbonFootprint, offsetCost, greenMarketingCampaigns, children }) => {
  validateProps(props);

  return (
    <div className="dashboard-ui">
      <h1>{title}</h1>
      {subtitle && <p aria-label="Subtitle">{subtitle}</p>}
      <div>
        <strong aria-label="Carbon Footprint">Carbon Footprint:</strong> {carbonFootprint} kg CO2e
      </div>
      <div>
        <strong aria-label="Offset Cost">Offset Cost:</strong> ${offsetCost}
      </div>
      <div>
        <strong aria-label="Green Marketing Campaigns">Green Marketing Campaigns:</strong> {greenMarketingCampaigns}
      </div>
      {children}
    </div>
  );
};

export default DashboardUI;

This updated code includes type checks for the props, a default value for the optional `subtitle` prop, ARIA labels for accessibility, a CSS class for styling, a validation function to check if the provided props are valid, and error handling for invalid props.