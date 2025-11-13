import React, { ReactNode } from 'react';
import { EcoScoreAnalytics as EcoScoreAnalyticsConstant } from '../../../constants';

if (!EcoScoreAnalyticsConstant) {
  console.error('EcoScoreAnalytics constant is not defined.');
}

type Props = {
  title: string;
  subtitle: string;
  content: string;
  className?: string;
};

const FooterLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    aria-label="Visit EcoScoreAnalytics website"
  >
    {children}
  </a>
);

const MyContentComponent: React.FC<Props> = ({ title, subtitle, content, className }) => {
  if (!title || !subtitle || !content) {
    return null;
  }

  // Add a default className for better maintainability
  const defaultClassName = 'my-content-component';
  const finalClassName = className || defaultClassName;

  // Use a try-catch block to handle any potential errors when rendering the content
  try {
    return (
      <div className={finalClassName}>
        <h1 aria-level="1">{title}</h1>
        <h2 aria-level="2">{subtitle}</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <footer>Powered by <FooterLink href={`https://www.ecoscoreanalytics.com`}>{EcoScoreAnalyticsConstant}</FooterLink></footer>
      </div>
    );
  } catch (error) {
    console.error('An error occurred while rendering the content:', error);
    return <div>An error occurred while rendering the content.</div>;
  }
};

export default MyContentComponent;

import React, { ReactNode } from 'react';
import { EcoScoreAnalytics as EcoScoreAnalyticsConstant } from '../../../constants';

if (!EcoScoreAnalyticsConstant) {
  console.error('EcoScoreAnalytics constant is not defined.');
}

type Props = {
  title: string;
  subtitle: string;
  content: string;
  className?: string;
};

const FooterLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    aria-label="Visit EcoScoreAnalytics website"
  >
    {children}
  </a>
);

const MyContentComponent: React.FC<Props> = ({ title, subtitle, content, className }) => {
  if (!title || !subtitle || !content) {
    return null;
  }

  // Add a default className for better maintainability
  const defaultClassName = 'my-content-component';
  const finalClassName = className || defaultClassName;

  // Use a try-catch block to handle any potential errors when rendering the content
  try {
    return (
      <div className={finalClassName}>
        <h1 aria-level="1">{title}</h1>
        <h2 aria-level="2">{subtitle}</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <footer>Powered by <FooterLink href={`https://www.ecoscoreanalytics.com`}>{EcoScoreAnalyticsConstant}</FooterLink></footer>
      </div>
    );
  } catch (error) {
    console.error('An error occurred while rendering the content:', error);
    return <div>An error occurred while rendering the content.</div>;
  }
};

export default MyContentComponent;