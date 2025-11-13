import React, { FC, ReactNode, Key } from 'react';
import { EcoFlowInsightsNewsletterProps } from './EcoFlowInsightsNewsletterProps';
import propTypes from 'prop-types';
import DOMPurify from 'dompurify';

type SanitizeFunction = (html: string) => ReactNode;

const sanitize: SanitizeFunction = (html: string, children?: ReactNode): ReactNode => {
  const sanitizedHtml = DOMPurify.sanitize(html);
  return typeof sanitizedHtml === 'string' ? <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} key={sanitizedHtml as Key} /> : sanitizedHtml;
};

interface EcoFlowInsightsNewsletterProps {
  message: string;
}

const EcoFlowInsightsNewsletter: FC<EcoFlowInsightsNewsletterProps> = ({ message = '' }) => {
  return <div className="ecoflow-insights-newsletter" aria-label="AI-powered sustainability analytics platform newsletter">{sanitize(message)}</div>;
};

EcoFlowInsightsNewsletter.propTypes = {
  message: propTypes.string.isRequired,
};

const MemoizedEcoFlowInsightsNewsletter = React.memo<FC<EcoFlowInsightsNewsletterProps>>(EcoFlowInsightsNewsletter);

export default MemoizedEcoFlowInsightsNewsletter;

import React, { FC, ReactNode, Key } from 'react';
import { EcoFlowInsightsNewsletterProps } from './EcoFlowInsightsNewsletterProps';
import propTypes from 'prop-types';
import DOMPurify from 'dompurify';

type SanitizeFunction = (html: string) => ReactNode;

const sanitize: SanitizeFunction = (html: string, children?: ReactNode): ReactNode => {
  const sanitizedHtml = DOMPurify.sanitize(html);
  return typeof sanitizedHtml === 'string' ? <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} key={sanitizedHtml as Key} /> : sanitizedHtml;
};

interface EcoFlowInsightsNewsletterProps {
  message: string;
}

const EcoFlowInsightsNewsletter: FC<EcoFlowInsightsNewsletterProps> = ({ message = '' }) => {
  return <div className="ecoflow-insights-newsletter" aria-label="AI-powered sustainability analytics platform newsletter">{sanitize(message)}</div>;
};

EcoFlowInsightsNewsletter.propTypes = {
  message: propTypes.string.isRequired,
};

const MemoizedEcoFlowInsightsNewsletter = React.memo<FC<EcoFlowInsightsNewsletterProps>>(EcoFlowInsightsNewsletter);

export default MemoizedEcoFlowInsightsNewsletter;