import React, { ReactNode, ReactElement } from 'react';
import { EcoBoxCuratorBrand } from '../brands'; // Import EcoBoxCuratorBrand interface for type safety

interface Props {
  brand: EcoBoxCuratorBrand; // Use brand instead of message for better type safety
  totalOrders?: number; // Add optional for totalOrders to handle edge cases
  totalRevenue?: number; // Add optional for totalRevenue to handle edge cases
  averageRating?: number; // Add optional for averageRating to handle edge cases
  topSellingProducts?: string[]; // Add optional for topSellingProducts to handle edge cases
}

const ReportComponent: React.FC<Props> = ({ brand, totalOrders, totalRevenue, averageRating, topSellingProducts }) => {
  // Add a default value for totalOrders, totalRevenue, averageRating, and topSellingProducts
  const defaultValues = {
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    topSellingProducts: [],
  };

  const { totalOrders = defaultValues.totalOrders, totalRevenue = defaultValues.totalRevenue, averageRating = defaultValues.averageRating, topSellingProducts = defaultValues.topSellingProducts } = props;

  return (
    <div>
      <h2 id="report-title">{brand.name}</h2>
      <p id="total-orders">Total Orders: {totalOrders}</p>
      <p id="total-revenue">Total Revenue: ${totalRevenue}</p>
      <p id="average-rating">Average Rating: {averageRating}</p>
      <h3 id="top-selling-products">Top Selling Products</h3>
      <ul>
        {topSellingProducts.map((product, index) => (
          <li key={index} id={`top-selling-product-${index}`}>{product}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReportComponent;

import React, { ReactNode, ReactElement } from 'react';
import { EcoBoxCuratorBrand } from '../brands'; // Import EcoBoxCuratorBrand interface for type safety

interface Props {
  brand: EcoBoxCuratorBrand; // Use brand instead of message for better type safety
  totalOrders?: number; // Add optional for totalOrders to handle edge cases
  totalRevenue?: number; // Add optional for totalRevenue to handle edge cases
  averageRating?: number; // Add optional for averageRating to handle edge cases
  topSellingProducts?: string[]; // Add optional for topSellingProducts to handle edge cases
}

const ReportComponent: React.FC<Props> = ({ brand, totalOrders, totalRevenue, averageRating, topSellingProducts }) => {
  // Add a default value for totalOrders, totalRevenue, averageRating, and topSellingProducts
  const defaultValues = {
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    topSellingProducts: [],
  };

  const { totalOrders = defaultValues.totalOrders, totalRevenue = defaultValues.totalRevenue, averageRating = defaultValues.averageRating, topSellingProducts = defaultValues.topSellingProducts } = props;

  return (
    <div>
      <h2 id="report-title">{brand.name}</h2>
      <p id="total-orders">Total Orders: {totalOrders}</p>
      <p id="total-revenue">Total Revenue: ${totalRevenue}</p>
      <p id="average-rating">Average Rating: {averageRating}</p>
      <h3 id="top-selling-products">Top Selling Products</h3>
      <ul>
        {topSellingProducts.map((product, index) => (
          <li key={index} id={`top-selling-product-${index}`}>{product}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReportComponent;