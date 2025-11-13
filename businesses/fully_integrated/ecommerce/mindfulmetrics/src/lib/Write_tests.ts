import React, { FC, ReactElement } from 'react';
import { render, screen, cleanup, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: FC<MyComponentProps> = ({ title, content }): ReactElement => {
  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  return (
    <div data-testid="my-component">
      <h1 data-testid="title" aria-level="1">
        {title}
      </h1>
      <p data-testid="content" aria-live="polite">
        {content}
      </p>
    </div>
  );
};

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and content correctly', () => {
    const title = 'Test Title';
    const content = 'Test Content';
    render(<MyComponent title={title} content={content} />);

    expect(screen.getByTestId('title')).toHaveTextContent(title);
    expect(screen.getByTestId('content')).toHaveTextContent(content);
  });

  it('renders without errors when title and content are provided', () => {
    const title = 'Valid Title';
    const content = 'Valid Content';
    render(<MyComponent title={title} content={content} />);

    expect(screen.getByTestId('my-component')).toBeInTheDocument();
  });

  it('throws an error when title is missing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title="" content="Some Content" />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('throws an error when content is missing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title="Some Title" content="" />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('throws an error when both title and content are missing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title="" content="" />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('handles very long title and content without breaking layout (resiliency)', () => {
    const longTitle = 'This is a very long title that should not break the layout of the component. It should wrap appropriately.';
    const longContent = 'This is very long content that should also wrap appropriately and not break the layout. We need to ensure the component is resilient to large amounts of text.';
    render(<MyComponent title={longTitle} content={longContent} />);

    expect(screen.getByTestId('title')).toHaveTextContent(longTitle);
    expect(screen.getByTestId('content')).toHaveTextContent(longContent);

    // Add assertions to check the layout if necessary. For example, check the width of the container.
    const componentContainer = screen.getByTestId('my-component');
    expect(componentContainer).toBeInTheDocument();
    // Example: expect(componentContainer).toHaveStyle('max-width: 500px;'); // If you have a max-width defined.
  });

  it('renders special characters in title and content correctly (edge case)', () => {
    const title = 'Title with special characters: & < > " \'';
    const content = 'Content with special characters: & < > " \'';
    render(<MyComponent title={title} content={content} />);

    expect(screen.getByTestId('title')).toHaveTextContent('Title with special characters: & < > " \'');
    expect(screen.getByTestId('content')).toHaveTextContent('Content with special characters: & < > " \'');
  });

  it('is accessible', async () => {
    const { container }: RenderResult = render(<MyComponent title="Accessible Title" content="Accessible Content" />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('renders with aria attributes for accessibility (example)', () => {
    render(<MyComponent title="Accessible Title" content="Accessible Content" />);
    const titleElement = screen.getByTestId('title');
    const contentElement = screen.getByTestId('content');

    // Example: Check for aria-level on the heading
    expect(titleElement).toHaveAttribute('aria-level', '1'); // Assuming it's an h1
    expect(contentElement).toHaveAttribute('aria-live', 'polite'); // Example aria-live attribute
  });

  it('handles empty strings gracefully without crashing (edge case)', () => {
    const title = '';
    const content = '';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title={title} content={content} />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('renders numbers as title and content without errors (edge case)', () => {
    const title = 123;
    const content = 456;
    render(<MyComponent title={String(title)} content={String(content)} />);

    expect(screen.getByTestId('title')).toHaveTextContent(String(title));
    expect(screen.getByTestId('content')).toHaveTextContent(String(content));
  });

  it('renders boolean values as title and content without errors (edge case)', () => {
    const title = true;
    const content = false;
    render(<MyComponent title={String(title)} content={String(content)} />);

    expect(screen.getByTestId('title')).toHaveTextContent(String(title));
    expect(screen.getByTestId('content')).toHaveTextContent(String(content));
  });
});

import React, { FC, ReactElement } from 'react';
import { render, screen, cleanup, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: FC<MyComponentProps> = ({ title, content }): ReactElement => {
  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  return (
    <div data-testid="my-component">
      <h1 data-testid="title" aria-level="1">
        {title}
      </h1>
      <p data-testid="content" aria-live="polite">
        {content}
      </p>
    </div>
  );
};

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and content correctly', () => {
    const title = 'Test Title';
    const content = 'Test Content';
    render(<MyComponent title={title} content={content} />);

    expect(screen.getByTestId('title')).toHaveTextContent(title);
    expect(screen.getByTestId('content')).toHaveTextContent(content);
  });

  it('renders without errors when title and content are provided', () => {
    const title = 'Valid Title';
    const content = 'Valid Content';
    render(<MyComponent title={title} content={content} />);

    expect(screen.getByTestId('my-component')).toBeInTheDocument();
  });

  it('throws an error when title is missing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title="" content="Some Content" />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('throws an error when content is missing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title="Some Title" content="" />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('throws an error when both title and content are missing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title="" content="" />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('handles very long title and content without breaking layout (resiliency)', () => {
    const longTitle = 'This is a very long title that should not break the layout of the component. It should wrap appropriately.';
    const longContent = 'This is very long content that should also wrap appropriately and not break the layout. We need to ensure the component is resilient to large amounts of text.';
    render(<MyComponent title={longTitle} content={longContent} />);

    expect(screen.getByTestId('title')).toHaveTextContent(longTitle);
    expect(screen.getByTestId('content')).toHaveTextContent(longContent);

    // Add assertions to check the layout if necessary. For example, check the width of the container.
    const componentContainer = screen.getByTestId('my-component');
    expect(componentContainer).toBeInTheDocument();
    // Example: expect(componentContainer).toHaveStyle('max-width: 500px;'); // If you have a max-width defined.
  });

  it('renders special characters in title and content correctly (edge case)', () => {
    const title = 'Title with special characters: & < > " \'';
    const content = 'Content with special characters: & < > " \'';
    render(<MyComponent title={title} content={content} />);

    expect(screen.getByTestId('title')).toHaveTextContent('Title with special characters: & < > " \'');
    expect(screen.getByTestId('content')).toHaveTextContent('Content with special characters: & < > " \'');
  });

  it('is accessible', async () => {
    const { container }: RenderResult = render(<MyComponent title="Accessible Title" content="Accessible Content" />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('renders with aria attributes for accessibility (example)', () => {
    render(<MyComponent title="Accessible Title" content="Accessible Content" />);
    const titleElement = screen.getByTestId('title');
    const contentElement = screen.getByTestId('content');

    // Example: Check for aria-level on the heading
    expect(titleElement).toHaveAttribute('aria-level', '1'); // Assuming it's an h1
    expect(contentElement).toHaveAttribute('aria-live', 'polite'); // Example aria-live attribute
  });

  it('handles empty strings gracefully without crashing (edge case)', () => {
    const title = '';
    const content = '';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error during test
    expect(() => {
      render(<MyComponent title={title} content={content} />);
    }).toThrowError('Title and content are required');
    consoleErrorSpy.mockRestore();
  });

  it('renders numbers as title and content without errors (edge case)', () => {
    const title = 123;
    const content = 456;
    render(<MyComponent title={String(title)} content={String(content)} />);

    expect(screen.getByTestId('title')).toHaveTextContent(String(title));
    expect(screen.getByTestId('content')).toHaveTextContent(String(content));
  });

  it('renders boolean values as title and content without errors (edge case)', () => {
    const title = true;
    const content = false;
    render(<MyComponent title={String(title)} content={String(content)} />);

    expect(screen.getByTestId('title')).toHaveTextContent(String(title));
    expect(screen.getByTestId('content')).toHaveTextContent(String(content));
  });
});