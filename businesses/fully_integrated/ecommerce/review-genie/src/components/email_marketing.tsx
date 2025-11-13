import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  altText?: string; // Add alt text for accessibility
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, altText }) => {
  return (
    <div role="presentation" style={{ margin: 0, padding: 0 }}> // Add role="presentation" to prevent Outlook from adding extra spacing
      <div style={{ width: '100%', maxWidth: '600px', padding: '20px', boxSizing: 'border-box' }}> // Use maxWidth instead of max-width for better browser compatibility
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{subject}</h1>
        <div style={{ fontSize: '16px', lineHeight: '1.5', margin: 0 }}>{message}</div>
        {children} // Render any additional content provided
        {children && <img src={children} alt={altText || ''} style={{ display: 'block', maxWidth: '100%', height: 'auto', margin: '20px 0' }} />} // Display the children as an image if it's an image element
      </div>
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  altText?: string; // Add alt text for accessibility
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, altText }) => {
  return (
    <div role="presentation" style={{ margin: 0, padding: 0 }}> // Add role="presentation" to prevent Outlook from adding extra spacing
      <div style={{ width: '100%', maxWidth: '600px', padding: '20px', boxSizing: 'border-box' }}> // Use maxWidth instead of max-width for better browser compatibility
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{subject}</h1>
        <div style={{ fontSize: '16px', lineHeight: '1.5', margin: 0 }}>{message}</div>
        {children} // Render any additional content provided
        {children && <img src={children} alt={altText || ''} style={{ display: 'block', maxWidth: '100%', height: 'auto', margin: '20px 0' }} />} // Display the children as an image if it's an image element
      </div>
    </div>
  );
};

export default MyEmailComponent;