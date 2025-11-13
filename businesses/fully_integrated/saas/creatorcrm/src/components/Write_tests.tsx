import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import sanitizeHtml from './sanitizeHtml';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  testId?: string;
}

const defaultClassName = 'my-component';

const MyComponent: FunctionComponent<Props> = ({ className = defaultClassName, message, testId, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message);

  return (
    <div
      className={className}
      {...rest}
      data-testid={testId}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage || '' }}
      aria-label={sanitizedMessage || ''}
    />
  );
};

export default MyComponent;

import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';
import sanitizeHtml from './sanitizeHtml';

jest.mock('./sanitizeHtml', () => ({
  sanitizeHtml: (html) => html.replace(/<[^>]*>/g, ''),
}));

describe('MyComponent', () => {
  it('renders the sanitized message', () => {
    const message = '<div>Test Message</div>';
    const { getByTestId } = render(<MyComponent message={message} />);

    expect(getByTestId('my-component')).toHaveTextContent('Test Message');
  });

  it('renders an empty string when message is empty', () => {
    const { getByTestId } = render(<MyComponent message="" />);

    expect(getByTestId('my-component')).toHaveTextContent('');
  });

  it('applies the provided className', () => {
    const className = 'custom-class';
    const { getByTestId } = render(<MyComponent message="" className={className} />);

    expect(getByTestId('my-component')).toHaveClass(className);
  });

  it('applies the provided aria-label', () => {
    const message = '<div>Test Message</div>';
    const { getByTestId, getByLabelText } = render(<MyComponent message={message} />);

    expect(getByTestId('my-component')).toHaveTextContent('Test Message');
    expect(getByLabelText('Test Message')).toBeInTheDocument();
  });
});

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import sanitizeHtml from './sanitizeHtml';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  testId?: string;
}

const defaultClassName = 'my-component';

const MyComponent: FunctionComponent<Props> = ({ className = defaultClassName, message, testId, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message);

  return (
    <div
      className={className}
      {...rest}
      data-testid={testId}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage || '' }}
      aria-label={sanitizedMessage || ''}
    />
  );
};

export default MyComponent;

import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';
import sanitizeHtml from './sanitizeHtml';

jest.mock('./sanitizeHtml', () => ({
  sanitizeHtml: (html) => html.replace(/<[^>]*>/g, ''),
}));

describe('MyComponent', () => {
  it('renders the sanitized message', () => {
    const message = '<div>Test Message</div>';
    const { getByTestId } = render(<MyComponent message={message} />);

    expect(getByTestId('my-component')).toHaveTextContent('Test Message');
  });

  it('renders an empty string when message is empty', () => {
    const { getByTestId } = render(<MyComponent message="" />);

    expect(getByTestId('my-component')).toHaveTextContent('');
  });

  it('applies the provided className', () => {
    const className = 'custom-class';
    const { getByTestId } = render(<MyComponent message="" className={className} />);

    expect(getByTestId('my-component')).toHaveClass(className);
  });

  it('applies the provided aria-label', () => {
    const message = '<div>Test Message</div>';
    const { getByTestId, getByLabelText } = render(<MyComponent message={message} />);

    expect(getByTestId('my-component')).toHaveTextContent('Test Message');
    expect(getByLabelText('Test Message')).toBeInTheDocument();
  });
});

sanitizeHtml.ts:

MyComponent.test.tsx: