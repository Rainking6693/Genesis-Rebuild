import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

const CustomerSupportBot: FC<Props> = ({ message, children, ...rest }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div data-testid="customer-support-bot" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest}>
      {children}
    </div>
  );
};

CustomerSupportBot.error = (error: Error) => {
  console.error('Potential XSS attack detected:', error);
};

CustomerSupportBot.defaultProps = {
  message: '',
  children: null,
};

const createSanitizedHTML = (html: string) => {
  try {
    const DOMParser = new DOMParser();
    const sanitizedDocument = DOMParser.parseFromString(html, 'text/html');

    // Remove script and style tags to prevent XSS attacks
    sanitizedDocument.querySelectorAll('script, style').forEach((node) => node.parentNode.removeChild(node));

    // Ensure the root element is a valid HTML element
    if (sanitizedDocument.doctype && sanitizedDocument.documentElement.nodeName.toLowerCase() !== 'html') {
      throw new Error('Invalid HTML structure');
    }

    return sanitizedDocument.documentElement.outerHTML;
  } catch (error) {
    CustomerSupportBot.error(error);
    return '';
  }
};

export default CustomerSupportBot;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

const CustomerSupportBot: FC<Props> = ({ message, children, ...rest }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div data-testid="customer-support-bot" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest}>
      {children}
    </div>
  );
};

CustomerSupportBot.error = (error: Error) => {
  console.error('Potential XSS attack detected:', error);
};

CustomerSupportBot.defaultProps = {
  message: '',
  children: null,
};

const createSanitizedHTML = (html: string) => {
  try {
    const DOMParser = new DOMParser();
    const sanitizedDocument = DOMParser.parseFromString(html, 'text/html');

    // Remove script and style tags to prevent XSS attacks
    sanitizedDocument.querySelectorAll('script, style').forEach((node) => node.parentNode.removeChild(node));

    // Ensure the root element is a valid HTML element
    if (sanitizedDocument.doctype && sanitizedDocument.documentElement.nodeName.toLowerCase() !== 'html') {
      throw new Error('Invalid HTML structure');
    }

    return sanitizedDocument.documentElement.outerHTML;
  } catch (error) {
    CustomerSupportBot.error(error);
    return '';
  }
};

export default CustomerSupportBot;