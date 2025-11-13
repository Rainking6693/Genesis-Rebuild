// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

const config = {
  initialMessages: [
    {
      id: 1,
      message: "Hello! How can I help you today?",
      trigger: "options",
    },
  ],
  widgets: [],
  options: [
    { value: "order_status", label: "Check Order Status", trigger: "order_status_response" },
    { value: "returns", label: "Returns & Exchanges", trigger: "returns_response" },
    { value: "product_info", label: "Product Information", trigger: "product_info_response" },
    { value: "contact", label: "Contact Support", trigger: "contact_response" },
  ],
  order_status_response: [
    {
      message: "Please enter your order number:",
      trigger: "order_number_input",
    },
  ],
  order_number_input: [
    {
      user: true,
      trigger: "order_status_check",
    },
  ],
  order_status_check: [
    {
      message: ({ previousValue }) => {
        try {
          // Simulate API call to check order status
          const orderNumber = previousValue;
          const orderStatus = getOrderStatus(orderNumber); // Replace with actual API call

          if (orderStatus) {
            return `Your order ${orderNumber} is currently: ${orderStatus}`;
          } else {
            return `Order ${orderNumber} not found. Please double-check the order number.`;
          }
        } catch (error) {
          console.error("Error checking order status:", error);
          return "Sorry, there was an error processing your request. Please try again later.";
        }
      },
      end: true,
    },
  ],
  returns_response: [
    {
      message: "Our return policy allows returns within 30 days of purchase. Please visit our returns page for more information.",
      end: true,
    },
  ],
  product_info_response: [
    {
      message: "Please enter the product name or ID:",
      trigger: "product_id_input",
    },
  ],
  product_id_input: [
    {
      user: true,
      trigger: "product_info_check",
    },
  ],
  product_info_check: [
    {
      message: ({ previousValue }) => {
        try {
          // Simulate API call to get product information
          const productId = previousValue;
          const productInfo = getProductInfo(productId); // Replace with actual API call

          if (productInfo) {
            return `Product Name: ${productInfo.name}, Price: ${productInfo.price}, Description: ${productInfo.description}`;
          } else {
            return `Product ${productId} not found. Please double-check the product ID.`;
          }
        } catch (error) {
          console.error("Error getting product information:", error);
          return "Sorry, there was an error processing your request. Please try again later.";
        }
      },
      end: true,
    },
  ],
  contact_response: [
    {
      message: "You can contact our support team via email at support@example.com or by phone at 555-123-4567.",
      end: true,
    },
  ],
};

// Placeholder functions for API calls (replace with actual API calls)
const getOrderStatus = (orderNumber: string) => {
  // Simulate API call to get order status
  if (orderNumber === "12345") {
    return "Shipped";
  } else {
    return null;
  }
};

const getProductInfo = (productId: string) => {
  // Simulate API call to get product information
  if (productId === "ABC123") {
    return {
      name: "Awesome Product",
      price: 99.99,
      description: "This is an awesome product!",
    };
  } else {
    return null;
  }
};

function CustomerSupportBot() {
  return (
    <div className="customer-support-bot">
      <Chatbot config={config} messageParser={null} actionProvider={null} />
    </div>
  );
}

export default CustomerSupportBot;