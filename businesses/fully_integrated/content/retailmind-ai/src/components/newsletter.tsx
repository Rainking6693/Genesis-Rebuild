import React, { FC, ReactNode, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(null);

  useEffect(() => {
    const sanitized = sanitizeUserInput(message);
    if (sanitized) {
      setSanitizedMessage(sanitized);
    }
  }, [message]);

  if (!sanitizedMessage) {
    return null;
  }

  const node: ReactNode = (
    <div data-testid="user-message" aria-label="User message">
      <p>{sanitizedMessage}</p>
    </div>
  );

  return node;
};

export default MyComponent;

// Jest test for the component
import React from 'react';
import MyComponent from './MyComponent';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('MyComponent', () => {
  it('renders the sanitized user message', () => {
    const message = '<script>alert("XSS")</script>';
    const sanitizedMessage = 'Safe message';

    const wrapper = mount(<MyComponent message={message} />);
    expect(wrapper.find('p').text()).toBe(sanitizedMessage);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('handles null or undefined message', () => {
    const wrapper = mount(<MyComponent />);
    expect(wrapper.find(MyComponent).prop('message')).toBeUndefined();
    expect(wrapper.find(MyComponent).html()).toBe('');
  });

  it('handles empty message', () => {
    const wrapper = mount(<MyComponent message="" />);
    expect(wrapper.find(MyComponent).prop('message')).toBe('');
    expect(wrapper.find(MyComponent).html()).toContain('<p></p>');
  });
});

import React, { FC, ReactNode, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(null);

  useEffect(() => {
    const sanitized = sanitizeUserInput(message);
    if (sanitized) {
      setSanitizedMessage(sanitized);
    }
  }, [message]);

  if (!sanitizedMessage) {
    return null;
  }

  const node: ReactNode = (
    <div data-testid="user-message" aria-label="User message">
      <p>{sanitizedMessage}</p>
    </div>
  );

  return node;
};

export default MyComponent;

// Jest test for the component
import React from 'react';
import MyComponent from './MyComponent';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('MyComponent', () => {
  it('renders the sanitized user message', () => {
    const message = '<script>alert("XSS")</script>';
    const sanitizedMessage = 'Safe message';

    const wrapper = mount(<MyComponent message={message} />);
    expect(wrapper.find('p').text()).toBe(sanitizedMessage);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('handles null or undefined message', () => {
    const wrapper = mount(<MyComponent />);
    expect(wrapper.find(MyComponent).prop('message')).toBeUndefined();
    expect(wrapper.find(MyComponent).html()).toBe('');
  });

  it('handles empty message', () => {
    const wrapper = mount(<MyComponent message="" />);
    expect(wrapper.find(MyComponent).prop('message')).toBe('');
    expect(wrapper.find(MyComponent).html()).toContain('<p></p>');
  });
});