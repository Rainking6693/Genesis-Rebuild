import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';
import { act } from 'react-dom/test-utils';
import { PropsWithChildren, ReactElement } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

describe('MyComponent', () => {
  const renderComponent = (props: PropsWithChildren<MyComponentProps>) => {
    return render(
      <Router history={createMemoryHistory()}>
        <i18n.Provider i18n={i18n}>
          <MyComponent {...props} />
        </i18n.Provider>
      </Router>
    );
  };

  const defaultProps: MyComponentProps = {
    message: 'Test message',
    loading: false,
    error: null,
    characterLimit: 100,
    darkMode: false,
    onClick: jest.fn(),
    onKeyDown: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  };

  it('should render the provided message', () => {
    const message = 'Test message';
    const { getByText } = renderComponent({ ...defaultProps, message });
    expect(getByText(message)).toBeInTheDocument();
  });

  it('should handle null or empty message', () => {
    const { container } = renderComponent({ ...defaultProps, message: null });
    expect(container.firstChild).toBeNull();

    const { container: emptyMessage } = renderComponent({ ...defaultProps, message: '' });
    expect(emptyMessage.firstChild).toHaveTextContent('');
  });

  it('should handle loading state', () => {
    const { getByTestId } = renderComponent({ ...defaultProps, loading: true });
    expect(getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const errorMessage = 'An error occurred';
    const { getByText } = renderComponent({ ...defaultProps, error: errorMessage });
    expect(getByText(errorMessage)).toBeInTheDocument();
  });

  it('should handle minimum character limit', () => {
    const { container } = renderComponent({ ...defaultProps, message: 'a'.repeat(99) });
    expect(container.firstChild).toHaveTextContent('a'.repeat(99));

    const { container: tooShort } = renderComponent({ ...defaultProps, message: 'a'.repeat(98) });
    expect(tooShort.firstChild).toHaveTextContent('Message too short');
  });

  it('should handle maximum character limit', () => {
    const { container } = renderComponent({ ...defaultProps, message: 'a'.repeat(101) });
    expect(container.firstChild).toHaveTextContent('Message too long');
  });

  it('should be accessible', () => {
    const message = 'Test message';
    const { container } = renderComponent({ ...defaultProps, message });
    expect(container).toHaveAccessibleChildren({
      roles: { 'button': { 'name': message } },
      properties: { 'aria-label': message },
    });
  });

  it('should handle dark mode', () => {
    i18n.changeLanguage('en-US-dark');
    const { container } = renderComponent({ ...defaultProps, darkMode: true });
    expect(container).toHaveClass('dark');
  });

  it('should handle focus management', async () => {
    const { getByText } = renderComponent({ ...defaultProps });
    const element = getByText('Test message');

    userEvent.click(element);
    expect(defaultProps.onFocus).toHaveBeenCalledTimes(1);
    expect(defaultProps.onFocus).toHaveBeenCalledWith(element);

    userEvent.tab();
    await waitFor(() => {
      expect(document.activeElement).not.toBe(element);
    });
    expect(defaultProps.onBlur).toHaveBeenCalledTimes(1);
    expect(defaultProps.onBlur).toHaveBeenCalledWith(element);
  });

  it('should handle internationalization', () => {
    i18n.changeLanguage('fr');
    const message = 'Message de test';
    const { getByText } = renderComponent({ ...defaultProps, message });
    expect(getByText(message)).toBeInTheDocument();
  });

  it('should handle onClick event', () => {
    const handleClick = jest.fn();
    const message = 'Test message';
    const { getByText } = renderComponent({ ...defaultProps, message, onClick: handleClick });

    fireEvent.click(getByText(message));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn();
    const message = 'Test message';
    const { getByText } = renderComponent({ ...defaultProps, message, onKeyDown: handleKeyDown });

    userEvent.keyboard('{Enter}');
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should handle invalid props', () => {
    const invalidProp = 'invalidProp';
    const { container } = renderComponent({ ...defaultProps, [invalidProp]: true });
    expect(container.firstChild).toHaveClass('bs-error');
  });
});

interface MyComponentProps extends PropsWithChildren {
  message?: string;
  loading?: boolean;
  error?: string | Error;
  characterLimit?: number;
  darkMode?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus?: (element: Element) => void;
  onBlur?: (element: Element) => void;
}

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';
import { act } from 'react-dom/test-utils';
import { PropsWithChildren, ReactElement } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

describe('MyComponent', () => {
  const renderComponent = (props: PropsWithChildren<MyComponentProps>) => {
    return render(
      <Router history={createMemoryHistory()}>
        <i18n.Provider i18n={i18n}>
          <MyComponent {...props} />
        </i18n.Provider>
      </Router>
    );
  };

  const defaultProps: MyComponentProps = {
    message: 'Test message',
    loading: false,
    error: null,
    characterLimit: 100,
    darkMode: false,
    onClick: jest.fn(),
    onKeyDown: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  };

  it('should render the provided message', () => {
    const message = 'Test message';
    const { getByText } = renderComponent({ ...defaultProps, message });
    expect(getByText(message)).toBeInTheDocument();
  });

  it('should handle null or empty message', () => {
    const { container } = renderComponent({ ...defaultProps, message: null });
    expect(container.firstChild).toBeNull();

    const { container: emptyMessage } = renderComponent({ ...defaultProps, message: '' });
    expect(emptyMessage.firstChild).toHaveTextContent('');
  });

  it('should handle loading state', () => {
    const { getByTestId } = renderComponent({ ...defaultProps, loading: true });
    expect(getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const errorMessage = 'An error occurred';
    const { getByText } = renderComponent({ ...defaultProps, error: errorMessage });
    expect(getByText(errorMessage)).toBeInTheDocument();
  });

  it('should handle minimum character limit', () => {
    const { container } = renderComponent({ ...defaultProps, message: 'a'.repeat(99) });
    expect(container.firstChild).toHaveTextContent('a'.repeat(99));

    const { container: tooShort } = renderComponent({ ...defaultProps, message: 'a'.repeat(98) });
    expect(tooShort.firstChild).toHaveTextContent('Message too short');
  });

  it('should handle maximum character limit', () => {
    const { container } = renderComponent({ ...defaultProps, message: 'a'.repeat(101) });
    expect(container.firstChild).toHaveTextContent('Message too long');
  });

  it('should be accessible', () => {
    const message = 'Test message';
    const { container } = renderComponent({ ...defaultProps, message });
    expect(container).toHaveAccessibleChildren({
      roles: { 'button': { 'name': message } },
      properties: { 'aria-label': message },
    });
  });

  it('should handle dark mode', () => {
    i18n.changeLanguage('en-US-dark');
    const { container } = renderComponent({ ...defaultProps, darkMode: true });
    expect(container).toHaveClass('dark');
  });

  it('should handle focus management', async () => {
    const { getByText } = renderComponent({ ...defaultProps });
    const element = getByText('Test message');

    userEvent.click(element);
    expect(defaultProps.onFocus).toHaveBeenCalledTimes(1);
    expect(defaultProps.onFocus).toHaveBeenCalledWith(element);

    userEvent.tab();
    await waitFor(() => {
      expect(document.activeElement).not.toBe(element);
    });
    expect(defaultProps.onBlur).toHaveBeenCalledTimes(1);
    expect(defaultProps.onBlur).toHaveBeenCalledWith(element);
  });

  it('should handle internationalization', () => {
    i18n.changeLanguage('fr');
    const message = 'Message de test';
    const { getByText } = renderComponent({ ...defaultProps, message });
    expect(getByText(message)).toBeInTheDocument();
  });

  it('should handle onClick event', () => {
    const handleClick = jest.fn();
    const message = 'Test message';
    const { getByText } = renderComponent({ ...defaultProps, message, onClick: handleClick });

    fireEvent.click(getByText(message));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn();
    const message = 'Test message';
    const { getByText } = renderComponent({ ...defaultProps, message, onKeyDown: handleKeyDown });

    userEvent.keyboard('{Enter}');
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should handle invalid props', () => {
    const invalidProp = 'invalidProp';
    const { container } = renderComponent({ ...defaultProps, [invalidProp]: true });
    expect(container.firstChild).toHaveClass('bs-error');
  });
});

interface MyComponentProps extends PropsWithChildren {
  message?: string;
  loading?: boolean;
  error?: string | Error;
  characterLimit?: number;
  darkMode?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus?: (element: Element) => void;
  onBlur?: (element: Element) => void;
}