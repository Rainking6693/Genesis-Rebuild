import nodemailer from 'nodemailer';
import { Customer } from './customer_data'; // Assuming customerData returns an array of Customer objects

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export function getEmailTransporter(): nodemailer.Transporter {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Add a catch block to handle errors during transporter creation
  transporter.once('error', (error) => {
    console.error('Error creating email transporter:', error);
  });

  return transporter;
}

export function sendPersonalizedOfferEmail(customerId: number, offer: string): Promise<void> {
  const transporter = getEmailTransporter();

  return new Promise(async (resolve, reject) => {
    const customer = await findCustomer(customerId);

    if (!customer) {
      // Log the error and return a more user-friendly message
      console.error(`Customer with ID ${customerId} not found.`);
      return reject(new Error('Customer not found.'));
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: 'Exclusive Return Reduction Offer',
      text: formatEmailText(customer, offer),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // Log the error and return the error to the caller
        console.error('Error sending email:', error);
        return reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function findCustomer(customerId: number): Promise<Customer | null> {
  // Use try-catch to handle errors when accessing customerData
  try {
    const customer = customerData.find((cust) => cust.id === customerId);
    return customer;
  } catch (error) {
    console.error('Error finding customer:', error);
    return null;
  }
}

function formatEmailText(customer: Customer, offer: string): string {
  // Use template literals for better readability and maintainability
  return `Dear ${customer.name},\n\nWe noticed that you've had some returns recently. To help you save time and money, we're offering you a special deal on our AI-powered return prediction and prevention platform. With ReturnIQ, you can reduce your return rates by 30-50% through smart product recommendations and return risk scoring. Plus, you'll get health & wellness coaching for buyers and micro-SaaS tools for sellers. Here's your personalized offer: ${offer}\n\nBest regards,\nThe ReturnIQ Team`;
}

import nodemailer from 'nodemailer';
import { Customer } from './customer_data'; // Assuming customerData returns an array of Customer objects

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export function getEmailTransporter(): nodemailer.Transporter {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Add a catch block to handle errors during transporter creation
  transporter.once('error', (error) => {
    console.error('Error creating email transporter:', error);
  });

  return transporter;
}

export function sendPersonalizedOfferEmail(customerId: number, offer: string): Promise<void> {
  const transporter = getEmailTransporter();

  return new Promise(async (resolve, reject) => {
    const customer = await findCustomer(customerId);

    if (!customer) {
      // Log the error and return a more user-friendly message
      console.error(`Customer with ID ${customerId} not found.`);
      return reject(new Error('Customer not found.'));
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: 'Exclusive Return Reduction Offer',
      text: formatEmailText(customer, offer),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // Log the error and return the error to the caller
        console.error('Error sending email:', error);
        return reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function findCustomer(customerId: number): Promise<Customer | null> {
  // Use try-catch to handle errors when accessing customerData
  try {
    const customer = customerData.find((cust) => cust.id === customerId);
    return customer;
  } catch (error) {
    console.error('Error finding customer:', error);
    return null;
  }
}

function formatEmailText(customer: Customer, offer: string): string {
  // Use template literals for better readability and maintainability
  return `Dear ${customer.name},\n\nWe noticed that you've had some returns recently. To help you save time and money, we're offering you a special deal on our AI-powered return prediction and prevention platform. With ReturnIQ, you can reduce your return rates by 30-50% through smart product recommendations and return risk scoring. Plus, you'll get health & wellness coaching for buyers and micro-SaaS tools for sellers. Here's your personalized offer: ${offer}\n\nBest regards,\nThe ReturnIQ Team`;
}