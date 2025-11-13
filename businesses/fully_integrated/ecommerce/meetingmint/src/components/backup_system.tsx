import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from '@material-ui/core';

interface Props {
  backupData: string;
}

const MyComponent: FC<Props> = ({ backupData }) => {
  const [sanitizedBackupData, setSanitizedBackupData] = useState('');

  useEffect(() => {
    const sanitizedData = sanitizeHtml(backupData, {
      allowedTags: ['div', 'p', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: {
        a: ['href', 'target', 'rel', 'aria-label'],
      },
    });
    setSanitizedBackupData(sanitizedData);
  }, [backupData]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <Helmet>
        <title>Backup System</title>
        <meta name="description" content="Backup data for the ecommerce business" />
      </Helmet>
      <div>
        <h2>Backup Data</h2>
        <div id="backup-data">{sanitizedBackupData}</div>
        <AccessibleDescription backupData={backupData} isMobile={isMobile} />
      </div>
    </>
  );
};

const AccessibleDescription: FC<{ backupData: string; isMobile: boolean }> = ({ backupData, isMobile }) => {
  return (
    <div>
      <h3>Description of Backup Data</h3>
      <p>
        This backup data contains information such as product details, customer
        information, and order history. Please ensure to store this data
        securely.
      </p>
      <p>
        {backupData.length} characters. To view the full backup data, please refer
        to the sanitized version above.
      </p>
      {!isMobile && (
        <>
          <h4>Allowed HTML Tags:</h4>
          <ul>
            <li>div</li>
            <li>p</li>
            <li>strong</li>
            <li>em</li>
            <li>a</li>
            <li>ul</li>
            <li>ol</li>
            <li>li</li>
          </ul>
          <h4>Allowed HTML Attributes:</h4>
          <ul>
            <li>a: href, target, rel, aria-label</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from '@material-ui/core';

interface Props {
  backupData: string;
}

const MyComponent: FC<Props> = ({ backupData }) => {
  const [sanitizedBackupData, setSanitizedBackupData] = useState('');

  useEffect(() => {
    const sanitizedData = sanitizeHtml(backupData, {
      allowedTags: ['div', 'p', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: {
        a: ['href', 'target', 'rel', 'aria-label'],
      },
    });
    setSanitizedBackupData(sanitizedData);
  }, [backupData]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <Helmet>
        <title>Backup System</title>
        <meta name="description" content="Backup data for the ecommerce business" />
      </Helmet>
      <div>
        <h2>Backup Data</h2>
        <div id="backup-data">{sanitizedBackupData}</div>
        <AccessibleDescription backupData={backupData} isMobile={isMobile} />
      </div>
    </>
  );
};

const AccessibleDescription: FC<{ backupData: string; isMobile: boolean }> = ({ backupData, isMobile }) => {
  return (
    <div>
      <h3>Description of Backup Data</h3>
      <p>
        This backup data contains information such as product details, customer
        information, and order history. Please ensure to store this data
        securely.
      </p>
      <p>
        {backupData.length} characters. To view the full backup data, please refer
        to the sanitized version above.
      </p>
      {!isMobile && (
        <>
          <h4>Allowed HTML Tags:</h4>
          <ul>
            <li>div</li>
            <li>p</li>
            <li>strong</li>
            <li>em</li>
            <li>a</li>
            <li>ul</li>
            <li>ol</li>
            <li>li</li>
          </ul>
          <h4>Allowed HTML Attributes:</h4>
          <ul>
            <li>a: href, target, rel, aria-label</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default MyComponent;