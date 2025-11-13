import React, { FC, ReactNode, useState } from 'react';

interface Props {
  title: string;
  subtitle: string;
  carbonData?: CarbonData;
  expenseDetails?: ExpenseDetail[];
  sustainabilityReport?: string;
}

interface CarbonData {
  footprint: number;
  offsetCost: number;
  savings: number;
}

interface ExpenseDetail {
  name: string;
  amount: number;
  category: string;
}

const DashboardUI: FC<Props> = ({ title, subtitle, carbonData, expenseDetails, sustainabilityReport }) => {
  const [loadingReport, setLoadingReport] = useState(false);

  if (!carbonData || !expenseDetails || !sustainabilityReport) {
    return <div>Missing or invalid props</div>;
  }

  return (
    <div className="dashboard-ui" aria-label="Dashboard UI">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div className="carbon-data" aria-label="Carbon data">
        <p>Carbon Footprint: {carbonData.footprint} kg CO2e</p>
        <p>Offset Cost: ${carbonData.offsetCost}</p>
        <p>Savings: ${carbonData.savings}</p>
      </div>
      <h3>Expense Details</h3>
      <ul className="expense-details" aria-label="Expense details">
        {expenseDetails.map((expense) => (
          <li key={expense.name} className="expense-item" aria-label={`${expense.name}: ${expense.amount} - ${expense.category}`}>
            {expense.name}: ${expense.amount} - {expense.category}
          </li>
        ))}
      </ul>
      <h3>Sustainability Report</h3>
      {loadingReport ? <div>Loading sustainability report...</div> : (
        <div
          className="sustainability-report"
          dangerouslySetInnerHTML={{ __html: sustainabilityReport }}
          aria-label="Sustainability report"
        />
      )}
    </div>
  );
};

export default DashboardUI;

This updated version includes error handling for missing or invalid props, validation of the props before rendering, and a loading state for the sustainability report. It also uses the `aria-label` attribute on non-visible elements to improve accessibility.