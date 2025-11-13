import React, { FC, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

interface Props {
  title: string;
  subtitle: string;
  data: {
    competitor1?: {
      name?: string;
      price?: number;
      profitMargin?: number;
    };
    competitor2?: {
      name?: string;
      price?: number;
      profitMargin?: number;
    };
    // Add more competitors as needed
    marketTrend?: {
      trend?: string;
      impact?: string;
    };
    inventory?: {
      level?: number;
      status?: string;
    };
    revenue?: {
      total?: number;
      change?: string;
      minimumValue?: number;
      maximumValue?: number;
    };
    profit?: {
      total?: number;
      change?: string;
      minimumValue?: number;
      maximumValue?: number;
    };
  };
}

// Define a ThemeContext to manage the theme
const ThemeContext = React.createContext<Theme>({
  primaryColor: '#3F51B5',
  secondaryColor: '#C5CAE9',
  fontFamily: 'Arial, sans-serif',
});

// Define a useTheme custom hook to access the theme
const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

const DashboardUI: FC<Props> = ({ title, subtitle, data }) => {
  const theme = useTheme();

  return (
    <div style={{ color: theme.secondaryColor, fontFamily: theme.fontFamily }}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div>
        {data && (
          <>
            {data.competitor1 && (
              <CompetitorSection key="competitor1" competitor={data.competitor1} theme={theme} />
            )}
            {data.competitor2 && (
              <CompetitorSection key="competitor2" competitor={data.competitor2} theme={theme} />
            )}
            {/* Add more CompetitorSection components as needed */}
            {data.marketTrend && (
              <MarketTrendSection key="marketTrend" trend={data.marketTrend.trend} impact={data.marketTrend.impact} />
            )}
            {data.inventory && (
              <InventorySection key="inventory" level={data.inventory.level} status={data.inventory.status} />
            )}
            {data.revenue && (
              <RevenueSection
                key="revenue"
                total={data.revenue.total}
                change={data.revenue.change}
                minimumValue={data.revenue.minimumValue || 0}
                maximumValue={data.revenue.maximumValue || Number.MAX_SAFE_INTEGER}
              />
            )}
            {data.profit && (
              <ProfitSection
                key="profit"
                total={data.profit.total}
                change={data.profit.change}
                minimumValue={data.profit.minimumValue || 0}
                maximumValue={data.profit.maximumValue || Number.MAX_SAFE_INTEGER}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Define separate components for each section
const CompetitorSection: FC<{ competitor?: any; theme: Theme }> = ({ competitor, theme }) => {
  return (
    <div>
      {competitor && (
        <>
          <h3>{competitor.name}</h3>
          <p>Price: {competitor.price}</p>
          <p>Profit Margin: {competitor.profitMargin}</p>
        </>
      )}
    </div>
  );
};

const MarketTrendSection: FC<{ trend?: string; impact?: string }> = ({ trend, impact }) => {
  return (
    <div>
      {trend && <h3 aria-label="Market Trend">Market Trend: {trend}</h3>}
      {impact && <p aria-label="Market Trend Impact">Impact: {impact}</p>}
    </div>
  );
};

const InventorySection: FC<{ level?: number; status?: string }> = ({ level, status }) => {
  return (
    <div>
      {level && <p aria-label="Inventory Level">Inventory Level: {level}</p>}
      {status && <p aria-label="Inventory Status">Inventory Status: {status}</p>}
    </div>
  );
};

const RevenueSection: FC<{ total?: number; change?: string; minimumValue?: number; maximumValue?: number }> = ({
  total,
  change,
  minimumValue,
  maximumValue,
}) => {
  return (
    <div>
      {total && (
        <>
          <p aria-label="Revenue">Revenue: {total}</p>
          {change && (
            <p aria-label="Revenue Change">Change: {change}</p>
          )}
        </>
      )}
    </div>
  );
};

const ProfitSection: FC<{ total?: number; change?: string; minimumValue?: number; maximumValue?: number }> = ({
  total,
  change,
  minimumValue,
  maximumValue,
}) => {
  return (
    <div>
      {total && (
        <>
          <p aria-label="Profit">Profit: {total}</p>
          {change && (
            <p aria-label="Profit Change">Change: {change}</p>
          )}
        </>
      )}
    </div>
  );
};

// Wrap the DashboardUI component with a ThemeProvider to provide the theme
const ThemeProvider = ({ children, theme }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export { DashboardUI, ThemeProvider };

Now the `DashboardUI` component is more resilient, accessible, and maintainable. The `ThemeProvider` can be used to provide the theme to the `DashboardUI` and other components that need it.