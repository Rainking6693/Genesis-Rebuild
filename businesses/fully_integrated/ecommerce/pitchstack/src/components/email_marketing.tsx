import React, { FC, ReactNode } from 'react';

interface LinkedInData {
  firstName: string;
  lastName: string;
}

interface CompanyData {
  companyName: string;
}

interface CRMData {
  industry: string;
}

interface Prospect {
  linkedInData?: LinkedInData | null;
  companyData?: CompanyData | null;
  crmData?: CRMData | null;
}

const defaultSubject = 'Welcome to Our Store';
const defaultBody = 'Discover great deals and exclusive offers on our ecommerce platform.';
const maxBodyLength = 1000; // Adjust as needed

const EmailComponent: FC<Props> = ({ prospect }: Props) => {
  const { linkedInData, companyData, crmData } = prospect;

  if (!linkedInData && !companyData && !crmData) {
    return null; // Return null if no data is available
  }

  const subject = generateSubject(linkedInData, companyData, crmData) || defaultSubject;
  const body = generateBody(linkedInData, companyData, crmData) || defaultBody;

  if (body.length > maxBodyLength) {
    body = body.substring(0, maxBodyLength) + '...'; // Truncate body if it exceeds the limit
  }

  return (
    <div aria-label="Email component" key={subject}>
      <h2>{subject}</h2>
      <p>{body}</p>
    </div>
  );
};

// Implement functions to generate personalized subject and body
function generateSubject(linkedInData, companyData, crmData) {
  let subject = defaultSubject;

  if (linkedInData && linkedInData.firstName && linkedInData.lastName) {
    subject = `Hello, ${linkedInData.firstName} ${linkedInData.lastName}!`;
  }

  if (companyData && companyData.companyName) {
    subject += `, from ${companyData.companyName}`;
  }

  if (crmData && crmData.industry) {
    subject += `, for ${crmData.industry}`;
  }

  return subject;
}

function generateBody(linkedInData, companyData, crmData) {
  let body = defaultBody;

  if (linkedInData && linkedInData.firstName && linkedInData.lastName) {
    body += `Dear ${linkedInData.firstName} ${linkedInData.lastName},`;
  }

  if (companyData && companyData.companyName) {
    body += `\nWe noticed that you work at ${companyData.companyName}.`;
  }

  if (crmData && crmData.industry) {
    body += `\nWe have some exciting offers that we believe would be beneficial for ${crmData.industry}.`;
  }

  return body;
}

export default EmailComponent;

import React, { FC, ReactNode } from 'react';

interface LinkedInData {
  firstName: string;
  lastName: string;
}

interface CompanyData {
  companyName: string;
}

interface CRMData {
  industry: string;
}

interface Prospect {
  linkedInData?: LinkedInData | null;
  companyData?: CompanyData | null;
  crmData?: CRMData | null;
}

const defaultSubject = 'Welcome to Our Store';
const defaultBody = 'Discover great deals and exclusive offers on our ecommerce platform.';
const maxBodyLength = 1000; // Adjust as needed

const EmailComponent: FC<Props> = ({ prospect }: Props) => {
  const { linkedInData, companyData, crmData } = prospect;

  if (!linkedInData && !companyData && !crmData) {
    return null; // Return null if no data is available
  }

  const subject = generateSubject(linkedInData, companyData, crmData) || defaultSubject;
  const body = generateBody(linkedInData, companyData, crmData) || defaultBody;

  if (body.length > maxBodyLength) {
    body = body.substring(0, maxBodyLength) + '...'; // Truncate body if it exceeds the limit
  }

  return (
    <div aria-label="Email component" key={subject}>
      <h2>{subject}</h2>
      <p>{body}</p>
    </div>
  );
};

// Implement functions to generate personalized subject and body
function generateSubject(linkedInData, companyData, crmData) {
  let subject = defaultSubject;

  if (linkedInData && linkedInData.firstName && linkedInData.lastName) {
    subject = `Hello, ${linkedInData.firstName} ${linkedInData.lastName}!`;
  }

  if (companyData && companyData.companyName) {
    subject += `, from ${companyData.companyName}`;
  }

  if (crmData && crmData.industry) {
    subject += `, for ${crmData.industry}`;
  }

  return subject;
}

function generateBody(linkedInData, companyData, crmData) {
  let body = defaultBody;

  if (linkedInData && linkedInData.firstName && linkedInData.lastName) {
    body += `Dear ${linkedInData.firstName} ${linkedInData.lastName},`;
  }

  if (companyData && companyData.companyName) {
    body += `\nWe noticed that you work at ${companyData.companyName}.`;
  }

  if (crmData && crmData.industry) {
    body += `\nWe have some exciting offers that we believe would be beneficial for ${crmData.industry}.`;
  }

  return body;
}

export default EmailComponent;