import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { PropsWithChildren, ReactElement } from 'react';
import { TestUtils } from '@react-aria/test-utils';

interface Props extends PropsWithChildren {
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, children }) => {
  // Adding a key prop for React's virtual DOM optimization
  // Using a unique key to avoid issues with re-rendering the same key
  const uniqueKey = Math.random().toString(36).substring(7);

  return (
    <div key={uniqueKey} data-testid="write-tests-component" data-testid-children={children.key}>
      {React.Children.map(children, (child, index) => {
        // Adding a unique key to the children elements to avoid issues with re-rendering the same key
        return React.cloneElement(child as ReactElement, { key: `${uniqueKey}-${index}` });
      })}
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

// Adding a default export for better code organization
export default FunctionalComponent;

import FunctionalComponent from './FunctionalComponent';
import { expect } from 'jest';
import { fireEvent as fireAriaEvent } from '@react-aria/test-utils';

describe('Write tests component', () => {
  it('renders the provided message', () => {
    const message = 'Test message';
    const { getByTestId } = render(<FunctionalComponent message={message} />);
    expect(getByTestId('write-tests-component')).toHaveTextContent(message);
  });

  it('handles edge cases with empty or null message', () => {
    const { queryByTestId } = render(<FunctionalComponent message={null} />);
    expect(queryByTestId('write-tests-component')).toBeNull();

    const { queryByText } = render(<FunctionalComponent message="" />);
    expect(queryByText('')).toBeNull();
  });

  it('is accessible', () => {
    const { container } = render(<FunctionalComponent message="Test message" />);
    const { getByRole } = TestUtils.withAria(container);

    expect(getByRole('region')).toBeInTheDocument();
  });

  it('validates the message prop type', () => {
    const wrongMessage = 123;

    expect(FunctionalComponent.propTypes.message).toBeDefined();
    expect(FunctionalComponent.propTypes.message.ofType).toBe('string');

    expect(() => render(<FunctionalComponent message={wrongMessage} />)).toThrow(
      'Expected prop "message" to be a string.'
    );
  });

  it('allows custom children', () => {
    const message = 'Test message';
    const child = <span data-testid="child">Test child</span>;

    const { getByTestId, getByTestId as getChildByTestId } = render(
      <FunctionalComponent message={message}>{child}</FunctionalComponent>
    );

    expect(getByTestId('write-tests-component')).toHaveTextContent(message);
    expect(getChildByTestId('child')).toBeInTheDocument();
  });

  it('allows custom event handling', async () => {
    const message = 'Test message';
    const handleClick = jest.fn();

    const { getByTestId } = render(
      <FunctionalComponent message={message}>
        <div data-testid="clickable-div" onClick={handleClick}>
          Click me
        </div>
      </FunctionalComponent>
    );

    const clickableDiv = getByTestId('clickable-div');
    fireEvent.click(clickableDiv);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles focus and keyboard events', async () => {
    const message = 'Test message';
    const handleKeyDown = jest.fn();

    const { getByTestId } = render(
      <FunctionalComponent message={message}>
        <input data-testid="input" onKeyDown={handleKeyDown} />
      </FunctionalComponent>
    );

    const input = getByTestId('input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('handles hover events', () => {
    const message = 'Test message';
    const handleMouseEnter = jest.fn();

    const { getByTestId } = render(
      <FunctionalComponent message={message}>
        <div data-testid="hoverable-div" onMouseEnter={handleMouseEnter}>
          Hover me
        </div>
      </FunctionalComponent>
    );

    const hoverableDiv = getByTestId('hoverable-div');
    fireEvent.mouseEnter(hoverableDiv);

    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('handles custom data attributes', () => {
    const message = 'Test message';
    const dataTestId = 'custom-data-testid';

    const { getByTestId } = render(
      <FunctionalComponent message={message} data-testid={dataTestId}>
        <div data-testid="child">Test child</div>
      </FunctionalComponent>
    );

    expect(getByTestId(dataTestId)).toBeInTheDocument();
  });

  it('handles different HTML tags for the message', () => {
    const message = '<h1>Test message</h1>';

    const { getByTestId } = render(<FunctionalComponent message={message} />);
    expect(getByTestId('write-tests-component')).toHaveTextContent('Test message');
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { PropsWithChildren, ReactElement } from 'react';
import { TestUtils } from '@react-aria/test-utils';

interface Props extends PropsWithChildren {
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, children }) => {
  // Adding a key prop for React's virtual DOM optimization
  // Using a unique key to avoid issues with re-rendering the same key
  const uniqueKey = Math.random().toString(36).substring(7);

  return (
    <div key={uniqueKey} data-testid="write-tests-component" data-testid-children={children.key}>
      {React.Children.map(children, (child, index) => {
        // Adding a unique key to the children elements to avoid issues with re-rendering the same key
        return React.cloneElement(child as ReactElement, { key: `${uniqueKey}-${index}` });
      })}
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

// Adding a default export for better code organization
export default FunctionalComponent;

import FunctionalComponent from './FunctionalComponent';
import { expect } from 'jest';
import { fireEvent as fireAriaEvent } from '@react-aria/test-utils';

describe('Write tests component', () => {
  it('renders the provided message', () => {
    const message = 'Test message';
    const { getByTestId } = render(<FunctionalComponent message={message} />);
    expect(getByTestId('write-tests-component')).toHaveTextContent(message);
  });

  it('handles edge cases with empty or null message', () => {
    const { queryByTestId } = render(<FunctionalComponent message={null} />);
    expect(queryByTestId('write-tests-component')).toBeNull();

    const { queryByText } = render(<FunctionalComponent message="" />);
    expect(queryByText('')).toBeNull();
  });

  it('is accessible', () => {
    const { container } = render(<FunctionalComponent message="Test message" />);
    const { getByRole } = TestUtils.withAria(container);

    expect(getByRole('region')).toBeInTheDocument();
  });

  it('validates the message prop type', () => {
    const wrongMessage = 123;

    expect(FunctionalComponent.propTypes.message).toBeDefined();
    expect(FunctionalComponent.propTypes.message.ofType).toBe('string');

    expect(() => render(<FunctionalComponent message={wrongMessage} />)).toThrow(
      'Expected prop "message" to be a string.'
    );
  });

  it('allows custom children', () => {
    const message = 'Test message';
    const child = <span data-testid="child">Test child</span>;

    const { getByTestId, getByTestId as getChildByTestId } = render(
      <FunctionalComponent message={message}>{child}</FunctionalComponent>
    );

    expect(getByTestId('write-tests-component')).toHaveTextContent(message);
    expect(getChildByTestId('child')).toBeInTheDocument();
  });

  it('allows custom event handling', async () => {
    const message = 'Test message';
    const handleClick = jest.fn();

    const { getByTestId } = render(
      <FunctionalComponent message={message}>
        <div data-testid="clickable-div" onClick={handleClick}>
          Click me
        </div>
      </FunctionalComponent>
    );

    const clickableDiv = getByTestId('clickable-div');
    fireEvent.click(clickableDiv);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles focus and keyboard events', async () => {
    const message = 'Test message';
    const handleKeyDown = jest.fn();

    const { getByTestId } = render(
      <FunctionalComponent message={message}>
        <input data-testid="input" onKeyDown={handleKeyDown} />
      </FunctionalComponent>
    );

    const input = getByTestId('input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('handles hover events', () => {
    const message = 'Test message';
    const handleMouseEnter = jest.fn();

    const { getByTestId } = render(
      <FunctionalComponent message={message}>
        <div data-testid="hoverable-div" onMouseEnter={handleMouseEnter}>
          Hover me
        </div>
      </FunctionalComponent>
    );

    const hoverableDiv = getByTestId('hoverable-div');
    fireEvent.mouseEnter(hoverableDiv);

    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('handles custom data attributes', () => {
    const message = 'Test message';
    const dataTestId = 'custom-data-testid';

    const { getByTestId } = render(
      <FunctionalComponent message={message} data-testid={dataTestId}>
        <div data-testid="child">Test child</div>
      </FunctionalComponent>
    );

    expect(getByTestId(dataTestId)).toBeInTheDocument();
  });

  it('handles different HTML tags for the message', () => {
    const message = '<h1>Test message</h1>';

    const { getByTestId } = render(<FunctionalComponent message={message} />);
    expect(getByTestId('write-tests-component')).toHaveTextContent('Test message');
  });
});