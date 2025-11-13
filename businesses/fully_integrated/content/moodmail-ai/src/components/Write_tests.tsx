import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title = '', content = '' }) => {
  // Resiliency and Edge Cases
  if (!title && !content) {
    return null; // Return null if both title and content are empty
  }

  // Accessibility
  return (
    <div data-testid="my-component" aria-label="My Component">
      {title && (
        <h1 data-testid="title" aria-label="Title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-label="Content">
          {content}
        </p>
      )}
    </div>
  );
};

export default MyComponent;

// Tests
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('should render with title and content', () => {
    render(<MyComponent title="Test Title" content="Test Content" />);
    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
  });

  it('should render with only title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should render with only content', () => {
    render(<MyComponent content="Test Content" />);
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
    expect(screen.queryByTestId('title')).not.toBeInTheDocument();
  });

  it('should not render if both title and content are empty', () => {
    render(<MyComponent />);
    expect(screen.queryByTestId('my-component')).not.toBeInTheDocument();
  });

  it('should have the correct accessibility attributes', () => {
    render(<MyComponent title="Test Title" content="Test Content" />);
    expect(screen.getByTestId('my-component')).toHaveAttribute('aria-label', 'My Component');
    expect(screen.getByTestId('title')).toHaveAttribute('aria-label', 'Title');
    expect(screen.getByTestId('content')).toHaveAttribute('aria-label', 'Content');
  });
});

import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title = '', content = '' }) => {
  // Resiliency and Edge Cases
  if (!title && !content) {
    return null; // Return null if both title and content are empty
  }

  // Accessibility
  return (
    <div data-testid="my-component" aria-label="My Component">
      {title && (
        <h1 data-testid="title" aria-label="Title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-label="Content">
          {content}
        </p>
      )}
    </div>
  );
};

export default MyComponent;

// Tests
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('should render with title and content', () => {
    render(<MyComponent title="Test Title" content="Test Content" />);
    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
  });

  it('should render with only title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should render with only content', () => {
    render(<MyComponent content="Test Content" />);
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
    expect(screen.queryByTestId('title')).not.toBeInTheDocument();
  });

  it('should not render if both title and content are empty', () => {
    render(<MyComponent />);
    expect(screen.queryByTestId('my-component')).not.toBeInTheDocument();
  });

  it('should have the correct accessibility attributes', () => {
    render(<MyComponent title="Test Title" content="Test Content" />);
    expect(screen.getByTestId('my-component')).toHaveAttribute('aria-label', 'My Component');
    expect(screen.getByTestId('title')).toHaveAttribute('aria-label', 'Title');
    expect(screen.getByTestId('content')).toHaveAttribute('aria-label', 'Content');
  });
});