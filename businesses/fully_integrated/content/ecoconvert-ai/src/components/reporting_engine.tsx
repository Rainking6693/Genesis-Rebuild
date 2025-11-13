import React from 'react';
import { EcoConvertAI } from '../../../constants';

interface Props {
  title: string;
  subtitle: string;
  data?: {
    carbonEmissions?: number;
    waterConsumption?: number;
    wasteProduction?: number;
    energyUsage?: number;
    costSavings?: number;
  };
}

const formatNumber = (num: number, decimalPlaces: number = 2) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: decimalPlaces }).format(num);

const ReportingEngine: React.FC<Props> = ({ title, subtitle, data }) => {
  const { carbonEmissions = 0, waterConsumption = 0, wasteProduction = 0, energyUsage = 0, costSavings = 0 } = data || {};

  return (
    <div>
      <h2 aria-label="Title of the report">{title}</h2>
      <h3 aria-label="Subtitle of the report">{subtitle}</h3>
      <div>
        <p>Carbon Emissions: {formatNumber(carbonEmissions)} kg CO2</p>
        <p>Water Consumption: {formatNumber(waterConsumption, 3)} L</p>
        <p>Waste Production: {formatNumber(wasteProduction)} kg</p>
        <p>Energy Usage: {formatNumber(energyUsage, 3)} kWh</p>
        <p>Estimated Cost Savings: ${formatNumber(costSavings)}</p>
      </div>
      <p>Join {EcoConvertAI} today and start reducing your environmental impact while increasing profits!</p>
    </div>
  );
};

export default ReportingEngine;

In this version, I've added type annotations for the props, improved the formatNumber function to use the Intl.NumberFormat API for better formatting, and added ARIA labels for accessibility. The water consumption is now formatted using the 'L' unit symbol for liters, and the component remains more maintainable by separating the formatting logic into a separate function.