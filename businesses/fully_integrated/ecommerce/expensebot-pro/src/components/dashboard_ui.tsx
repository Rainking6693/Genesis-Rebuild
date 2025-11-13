import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  data?: {
    totalExpenses?: number;
    topCategories?: { name: string; amount: number }[];
    recentTransactions?: {
      date: string;
      category: string;
      amount: number;
    }[];
  };
}

const DashboardUI: FC<Props> = ({ title, subtitle, data }) => {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const renderListItem = (item: { name: string; amount: number }) => (
    <li key={item.name} role="listitem">
      {item.name}: {formatCurrency(item.amount)}
    </li>
  );

  const renderTransaction = (transaction: {
    date: string;
    category: string;
    amount: number;
  }) => (
    <li key={transaction.date} role="listitem">
      {transaction.date}: {transaction.category}: {formatCurrency(transaction.amount)}
    </li>
  );

  const handleEmptyData = (): ReactNode => (
    <div>
      <p>No data available.</p>
    </div>
  );

  const renderTopCategories = () => (
    <>
      {data?.topCategories?.length > 0 && (
        <>
          <h3>Top Categories:</h3>
          <ul role="list">{data?.topCategories?.map(renderListItem)}</ul>
        </>
      )}
    </>
  );

  const renderRecentTransactions = () => (
    <>
      {data?.recentTransactions?.length > 0 && (
        <>
          <h3>Recent Transactions:</h3>
          <ul role="list">{data?.recentTransactions?.map(renderTransaction)}</ul>
        </>
      )}
    </>
  );

  return (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div>
        {data?.totalExpenses && (
          <h2>Total Expenses: {data.totalExpenses}</h2>
        )}
        {renderTopCategories()}
        {renderRecentTransactions()}
      </div>
      {!data?.totalExpenses && !data?.topCategories?.length && !data?.recentTransactions?.length && handleEmptyData()}
    </div>
  );
};

export default DashboardUI;

Changes made:

1. Made the `data` property optional to handle edge cases where no data is provided.
2. Added `role="listitem"` to each list item for better accessibility.
3. Separated the rendering of top categories and recent transactions into separate functions for better maintainability.
4. Rendered the empty data message only when no data is provided at all (totalExpenses, topCategories, and recentTransactions are all empty).
5. Added a `role="list"` to the ul elements for better accessibility.