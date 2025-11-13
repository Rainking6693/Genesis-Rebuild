import React, { useContext } from 'react';
import { CarbonCredContext, CarbonCredContextType } from '../../contexts/CarbonCredContext';

interface Props {
  title: string;
  content: string;
}

const MyComponent: React.FC<Props> = ({ title, content }) => {
  const { currencySymbol } = useContext(CarbonCredContext);

  // Check if currencySymbol is defined before using it
  if (!currencySymbol) {
    return <div>Error: Missing currencySymbol from CarbonCredContext</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <p>Earn {currencySymbol} for every carbon credit generated with CarbonCred!</p>
    </div>
  );
};

export default MyComponent;

// CarbonCredContext.ts
import { createContext, useState } from 'react';

interface CarbonCredContextType {
  currencySymbol: string | undefined;
  updateCurrencySymbol: (newCurrencySymbol: string) => void;
}

const CarbonCredContext = createContext<CarbonCredContextType>({ currencySymbol: undefined, updateCurrencySymbol: () => {} });

export const CarbonCredProvider: React.FC = ({ children }) => {
  const [currencySymbol, setCurrencySymbol] = useState<string | undefined>('$');

  // Add a method to update the currencySymbol
  const updateCurrencySymbol = (newCurrencySymbol: string) => {
    setCurrencySymbol(newCurrencySymbol);
  };

  return (
    <CarbonCredContext.Provider value={{ currencySymbol, updateCurrencySymbol }}>
      {children}
    </CarbonCredContext.Provider>
  );
};

export { CarbonCredContext, CarbonCredProvider };

In this updated code, I've added a `updateCurrencySymbol` method to the `CarbonCredContextType` interface and passed it to the context provider. This allows the `MyComponent` to update the currency symbol when needed, improving maintainability.

For accessibility, I've used the `h1` tag for the title, which is semantically correct and helps screen readers understand the structure of the content.

Lastly, I've updated the context and the context provider to include the `updateCurrencySymbol` method, making the code more descriptive and easier to understand. This makes the code more maintainable.