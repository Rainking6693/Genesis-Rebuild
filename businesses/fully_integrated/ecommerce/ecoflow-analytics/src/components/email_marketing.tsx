import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  altText?: string; // Add alt text for accessibility
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, altText }) => {
  return (
    <div role="presentation" style={{ margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' }}>
      <div style={{ display: 'none', font-size: 1, mso-hide: 'all', font-family: 'arial, sans-serif' }}>
        {/* Hide from screen readers */}
        {children}
      </div>
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: 0 }}>{subject}</h2>
          <div style={{ margin: '10px 0' }}>{message}</div>
          {children && (
            <>
              {/* Add a fallback for children when they are not provided */}
              {children}
              {/* Add a fallback for screen readers when children are not provided */}
              {!children && altText && <div>{altText}</div>}
            </>
          )}
        </div>
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
    <div role="presentation" style={{ margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' }}>
      <div style={{ display: 'none', font-size: 1, mso-hide: 'all', font-family: 'arial, sans-serif' }}>
        {/* Hide from screen readers */}
        {children}
      </div>
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: 0 }}>{subject}</h2>
          <div style={{ margin: '10px 0' }}>{message}</div>
          {children && (
            <>
              {/* Add a fallback for children when they are not provided */}
              {children}
              {/* Add a fallback for screen readers when children are not provided */}
              {!children && altText && <div>{altText}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEmailComponent;