import React, { FC, ReactNode } from 'react';

type TopReview = string;
type Props = {
  reviewCount: number;
  averageRating: number;
  totalSales: number;
  topReview: TopReview;
  error?: Error; // Add error prop for handling potential API errors
  children?: ReactNode; // Add children prop for future flexibility
};

const DashboardUI: FC<Props> = ({ children, reviewCount, averageRating, totalSales, topReview, error }) => {
  if (error) {
    return (
      <div data-testid="error-section">
        <h1>Ecommerce Dashboard</h1>
        <section>
          <h2>Error</h2>
          <p>{error.message}</p>
        </section>
      </div>
    );
  }

  if (typeof reviewCount !== 'number' || typeof averageRating !== 'number' || typeof totalSales !== 'number') {
    return (
      <div>
        <h1>Ecommerce Dashboard</h1>
        <section>
          <h2>Review Statistics</h2>
          <ul>
            <li>Total Reviews: {reviewCount || 'N/A'}</li>
            <li>Average Rating: {averageRating || 'N/A'}</li>
            <li>Total Sales: {totalSales || 'N/A'}</li>
          </ul>
        </section>
        <section>
          <h2>Top Review</h2>
          <p>{topReview}</p>
        </section>
      </div>
    );
  }

  return (
    <div>
      <h1>Ecommerce Dashboard</h1>
      <section>
        <h2>Review Statistics</h2>
        <ul>
          <li aria-label="Total Reviews">Total Reviews: {reviewCount}</li>
          <li aria-label="Average Rating">Average Rating: {averageRating}</li>
          <li aria-label="Total Sales">Total Sales: {totalSales}</li>
        </ul>
      </section>
      <section>
        <h2>Top Review</h2>
        <p>{topReview}</p>
      </section>
      {children}
    </div>
  );
};

export default DashboardUI;

import React, { FC, ReactNode } from 'react';

type TopReview = string;
type Props = {
  reviewCount: number;
  averageRating: number;
  totalSales: number;
  topReview: TopReview;
  error?: Error; // Add error prop for handling potential API errors
  children?: ReactNode; // Add children prop for future flexibility
};

const DashboardUI: FC<Props> = ({ children, reviewCount, averageRating, totalSales, topReview, error }) => {
  if (error) {
    return (
      <div data-testid="error-section">
        <h1>Ecommerce Dashboard</h1>
        <section>
          <h2>Error</h2>
          <p>{error.message}</p>
        </section>
      </div>
    );
  }

  if (typeof reviewCount !== 'number' || typeof averageRating !== 'number' || typeof totalSales !== 'number') {
    return (
      <div>
        <h1>Ecommerce Dashboard</h1>
        <section>
          <h2>Review Statistics</h2>
          <ul>
            <li>Total Reviews: {reviewCount || 'N/A'}</li>
            <li>Average Rating: {averageRating || 'N/A'}</li>
            <li>Total Sales: {totalSales || 'N/A'}</li>
          </ul>
        </section>
        <section>
          <h2>Top Review</h2>
          <p>{topReview}</p>
        </section>
      </div>
    );
  }

  return (
    <div>
      <h1>Ecommerce Dashboard</h1>
      <section>
        <h2>Review Statistics</h2>
        <ul>
          <li aria-label="Total Reviews">Total Reviews: {reviewCount}</li>
          <li aria-label="Average Rating">Average Rating: {averageRating}</li>
          <li aria-label="Total Sales">Total Sales: {totalSales}</li>
        </ul>
      </section>
      <section>
        <h2>Top Review</h2>
        <p>{topReview}</p>
      </section>
      {children}
    </div>
  );
};

export default DashboardUI;