import React, { Key, ReactNode } from 'react';

interface ShoppingCartProps {
  carbonFootprint: number;
  lowerImpactAlternatives: Array<{ name: string; carbonFootprint: number }>;
  offsetOptions: Array<{ name: string; cost: number; carbonOffset: number }>;
  onOffsetPurchase: (option: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  carbonFootprint,
  lowerImpactAlternatives,
  offsetOptions,
  onOffsetPurchase,
}) => {
  // Add a check to ensure arrays are not empty
  if (!lowerImpactAlternatives.length && !offsetOptions.length) {
    return <p>No lower impact alternatives or carbon offset options available.</p>;
  }

  return (
    <div className="shopping-cart">
      <h2>Your Carbon Footprint: {carbonFootprint} kg CO2e</h2>
      <h3>Lower Impact Alternatives</h3>
      <ul>
        {lowerImpactAlternatives.map((alternative) => (
          // Use a Fragment to avoid adding extra <li> elements when there's only one alternative
          <>
            {lowerImpactAlternatives.length > 1 && <hr />}
            <li key={alternative.name} role="listitem">
              {alternative.name} - {alternative.carbonFootprint} kg CO2e
            </li>
          </>
        ))}
      </ul>
      <h3>Carbon Offset Options</h3>
      <ul>
        {offsetOptions.map((option) => (
          // Use a Fragment to avoid adding extra <li> elements when there's only one option
          <>
            {offsetOptions.length > 1 && <hr />}
            <li key={option.name} role="listitem">
              <span>{option.name}</span>
              <span> - ${option.cost} - Offsets {option.carbonOffset} kg CO2e</span>
              <button onClick={() => onOffsetPurchase(option.name)}>Buy Offset</button>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingCart;

import React, { Key, ReactNode } from 'react';

interface ShoppingCartProps {
  carbonFootprint: number;
  lowerImpactAlternatives: Array<{ name: string; carbonFootprint: number }>;
  offsetOptions: Array<{ name: string; cost: number; carbonOffset: number }>;
  onOffsetPurchase: (option: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  carbonFootprint,
  lowerImpactAlternatives,
  offsetOptions,
  onOffsetPurchase,
}) => {
  // Add a check to ensure arrays are not empty
  if (!lowerImpactAlternatives.length && !offsetOptions.length) {
    return <p>No lower impact alternatives or carbon offset options available.</p>;
  }

  return (
    <div className="shopping-cart">
      <h2>Your Carbon Footprint: {carbonFootprint} kg CO2e</h2>
      <h3>Lower Impact Alternatives</h3>
      <ul>
        {lowerImpactAlternatives.map((alternative) => (
          // Use a Fragment to avoid adding extra <li> elements when there's only one alternative
          <>
            {lowerImpactAlternatives.length > 1 && <hr />}
            <li key={alternative.name} role="listitem">
              {alternative.name} - {alternative.carbonFootprint} kg CO2e
            </li>
          </>
        ))}
      </ul>
      <h3>Carbon Offset Options</h3>
      <ul>
        {offsetOptions.map((option) => (
          // Use a Fragment to avoid adding extra <li> elements when there's only one option
          <>
            {offsetOptions.length > 1 && <hr />}
            <li key={option.name} role="listitem">
              <span>{option.name}</span>
              <span> - ${option.cost} - Offsets {option.carbonOffset} kg CO2e</span>
              <button onClick={() => onOffsetPurchase(option.name)}>Buy Offset</button>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingCart;