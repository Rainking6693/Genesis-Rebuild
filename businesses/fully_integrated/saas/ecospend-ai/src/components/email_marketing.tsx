import React from 'react';

// Add type for EcoSpendAI_EmailTemplate
type EmailTemplateProps = {
  recipientEmail: string;
  subject: string;
  carbonFootprintSavings: number | null;
  ecoFriendlyAlternatives: string[];
};

// Add type for MyComponent
type MyComponentProps = EmailTemplateProps;

const MyComponent: React.FC<MyComponentProps> = ({ recipientEmail, subject, carbonFootprintSavings = 0, ecoFriendlyAlternatives }) => {
  return (
    <div>
      <EcoSpendAI_EmailTemplate {...{ recipientEmail, subject }}>
        <p>
          {carbonFootprintSavings > 0 ? `Congratulations! You have saved ${carbonFootprintSavings} CO2 emissions by using EcoSpend AI.` : 'You have not saved any CO2 emissions yet. Keep using EcoSpend AI to reduce your carbon footprint.'}
        </p>
        <ul>
          {ecoFriendlyAlternatives.map((alternative, index) => (
            <li key={index}>{alternative}</li>
          ))}
        </ul>
        <p>Keep up the great work in reducing your business's carbon footprint and saving costs with EcoSpend AI.</p>
      </EcoSpendAI_EmailTemplate>
    </div>
  );
};

export default MyComponent;

import React from 'react';

// Add type for EcoSpendAI_EmailTemplate
type EmailTemplateProps = {
  recipientEmail: string;
  subject: string;
  carbonFootprintSavings: number | null;
  ecoFriendlyAlternatives: string[];
};

// Add type for MyComponent
type MyComponentProps = EmailTemplateProps;

const MyComponent: React.FC<MyComponentProps> = ({ recipientEmail, subject, carbonFootprintSavings = 0, ecoFriendlyAlternatives }) => {
  return (
    <div>
      <EcoSpendAI_EmailTemplate {...{ recipientEmail, subject }}>
        <p>
          {carbonFootprintSavings > 0 ? `Congratulations! You have saved ${carbonFootprintSavings} CO2 emissions by using EcoSpend AI.` : 'You have not saved any CO2 emissions yet. Keep using EcoSpend AI to reduce your carbon footprint.'}
        </p>
        <ul>
          {ecoFriendlyAlternatives.map((alternative, index) => (
            <li key={index}>{alternative}</li>
          ))}
        </ul>
        <p>Keep up the great work in reducing your business's carbon footprint and saving costs with EcoSpend AI.</p>
      </EcoSpendAI_EmailTemplate>
    </div>
  );
};

export default MyComponent;