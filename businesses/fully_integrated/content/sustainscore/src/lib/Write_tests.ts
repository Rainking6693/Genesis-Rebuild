import React from 'react';
import { render, screen, cleanup, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent, { MyComponentProps } from './MyComponent';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  afterEach(() => {
    cleanup();
  });

  const renderComponent = (props: Partial<MyComponentProps> = {}) => {
    return render(<MyComponent title="Test Title" content="Test Content" {...props} />);
  };

  it('renders with title and content', () => {
    const { getByTestId } = renderComponent();
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test Title');
    expect(contentElement).toHaveTextContent('Test Content');
  });

  it('renders with empty title and content', () => {
    const { getByTestId } = renderComponent({ title: '', content: '' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('');
    expect(contentElement).toHaveTextContent('');
  });

  it('renders with special characters in title and content', () => {
    const { getByTestId } = renderComponent({
      title: 'Title with & < > " \'',
      content: 'Content with & < > " \'',
    });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Title with & < > " \'');
    expect(contentElement).toHaveTextContent('Content with & < > " \'');
  });

  it('renders with very long title and content', () => {
    const longText = 'This is a very long string '.repeat(100);
    const { getByTestId } = renderComponent({ title: longText, content: longText });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(longText);
    expect(contentElement).toHaveTextContent(longText);
  });

  it('renders with unicode characters', () => {
    const { getByTestId } = renderComponent({ title: '你好世界', content: 'こんにちは世界' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('你好世界');
    expect(contentElement).toHaveTextContent('こんにちは世界');
  });

  it('does not throw an error when title or content is null or undefined', () => {
    const { rerender, getByTestId } = renderComponent();

    rerender(<MyComponent title={null as any} content="New Content" />);
    const titleElement = getByTestId('title');
    expect(titleElement).toHaveTextContent('');

    rerender(<MyComponent title="New Title" content={undefined as any} />);
    const contentElement = getByTestId('content');
    expect(contentElement).toHaveTextContent('');

    rerender(<MyComponent title={undefined as any} content={undefined as any} />);
    const titleElement2 = getByTestId('title');
    const contentElement2 = getByTestId('content');
    expect(titleElement2).toHaveTextContent('');
    expect(contentElement2).toHaveTextContent('');
  });

  it('has no accessibility violations', async () => {
    const { container }: RenderResult = renderComponent({
      title: 'Accessible Title',
      content: 'Accessible Content',
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('container has correct data-testid', () => {
    const { getByTestId } = renderComponent();
    const componentContainer = getByTestId('my-component');
    expect(componentContainer).toBeInTheDocument();
  });

  it('handles title and content with leading/trailing whitespace', () => {
    const { getByTestId } = renderComponent({ title: '  Test Title  ', content: '  Test Content  ' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('  Test Title  ');
    expect(contentElement).toHaveTextContent('  Test Content  ');
  });

  it('handles title and content with multiple lines', () => {
    const { getByTestId } = renderComponent({ title: 'Test\nTitle', content: 'Test\nContent' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test\nTitle');
    expect(contentElement).toHaveTextContent('Test\nContent');
  });
});

import React from 'react';
import { render, screen, cleanup, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent, { MyComponentProps } from './MyComponent';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  afterEach(() => {
    cleanup();
  });

  const renderComponent = (props: Partial<MyComponentProps> = {}) => {
    return render(<MyComponent title="Test Title" content="Test Content" {...props} />);
  };

  it('renders with title and content', () => {
    const { getByTestId } = renderComponent();
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test Title');
    expect(contentElement).toHaveTextContent('Test Content');
  });

  it('renders with empty title and content', () => {
    const { getByTestId } = renderComponent({ title: '', content: '' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('');
    expect(contentElement).toHaveTextContent('');
  });

  it('renders with special characters in title and content', () => {
    const { getByTestId } = renderComponent({
      title: 'Title with & < > " \'',
      content: 'Content with & < > " \'',
    });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Title with & < > " \'');
    expect(contentElement).toHaveTextContent('Content with & < > " \'');
  });

  it('renders with very long title and content', () => {
    const longText = 'This is a very long string '.repeat(100);
    const { getByTestId } = renderComponent({ title: longText, content: longText });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(longText);
    expect(contentElement).toHaveTextContent(longText);
  });

  it('renders with unicode characters', () => {
    const { getByTestId } = renderComponent({ title: '你好世界', content: 'こんにちは世界' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('你好世界');
    expect(contentElement).toHaveTextContent('こんにちは世界');
  });

  it('does not throw an error when title or content is null or undefined', () => {
    const { rerender, getByTestId } = renderComponent();

    rerender(<MyComponent title={null as any} content="New Content" />);
    const titleElement = getByTestId('title');
    expect(titleElement).toHaveTextContent('');

    rerender(<MyComponent title="New Title" content={undefined as any} />);
    const contentElement = getByTestId('content');
    expect(contentElement).toHaveTextContent('');

    rerender(<MyComponent title={undefined as any} content={undefined as any} />);
    const titleElement2 = getByTestId('title');
    const contentElement2 = getByTestId('content');
    expect(titleElement2).toHaveTextContent('');
    expect(contentElement2).toHaveTextContent('');
  });

  it('has no accessibility violations', async () => {
    const { container }: RenderResult = renderComponent({
      title: 'Accessible Title',
      content: 'Accessible Content',
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('container has correct data-testid', () => {
    const { getByTestId } = renderComponent();
    const componentContainer = getByTestId('my-component');
    expect(componentContainer).toBeInTheDocument();
  });

  it('handles title and content with leading/trailing whitespace', () => {
    const { getByTestId } = renderComponent({ title: '  Test Title  ', content: '  Test Content  ' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('  Test Title  ');
    expect(contentElement).toHaveTextContent('  Test Content  ');
  });

  it('handles title and content with multiple lines', () => {
    const { getByTestId } = renderComponent({ title: 'Test\nTitle', content: 'Test\nContent' });
    const titleElement = getByTestId('title');
    const contentElement = getByTestId('content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test\nTitle');
    expect(contentElement).toHaveTextContent('Test\nContent');
  });
});