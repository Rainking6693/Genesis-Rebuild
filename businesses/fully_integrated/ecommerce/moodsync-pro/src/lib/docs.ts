import React, { FC, useMemo, PropsWithChildren } from 'react';
import ReactXSS from 'react-xss';

type Props = PropsWithChildren & {
  message?: string;
  ariaLabel?: string;
  className?: string;
};

type XSSFC<P> = FC<P> & {
  errorComponent?: React.ReactNode;
};

declare module 'react' {
  interface HTMLAttributes<T> {
    dangerouslySetInnerHTML?: { __html: string };
    ariaLabel?: string;
  }

  type FC<P> = XSSFC<P>;
}

const MyComponent: XSSFC<Props> = ({ children, message, ariaLabel, className }) => {
  const MemoizedMyComponent = useMemo(() => MyComponent, []);

  const xssMessage = useMemo(() => {
    if (message) {
      try {
        return ReactXSS.html(message);
      } catch {
        return { __html: '<div>Error: XSS sanitization failed.</div>' };
      }
    }
    return {};
  }, [message]);

  if (!xssMessage.__html && children) {
    return children;
  }

  return (
    <div aria-label={ariaLabel} className={className}>
      <div dangerouslySetInnerHTML={xssMessage} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  ariaLabel: 'MyComponent',
};

MyComponent.errorComponent = () => <div>Error: Invalid or malicious content detected.</div>;

MyComponent.displayName = 'MyComponent';

// Use XSS-sanitized version of React for user-generated content
const XSSReact = ReactXSS(React);

// Use XSS-sanitized version of FC for user-generated content
const XSSFC = XSSReact.FC as XSSFC;

const MyComponentXSS: XSSFC<Props> = ({ children, message, ariaLabel, className }) => {
  const xssMessage = useMemo(() => {
    if (message) {
      try {
        return XSSReact.html(message);
      } catch {
        return { __html: '<div>Error: XSS sanitization failed.</div>' };
      }
    }
    return {};
  }, [message]);

  if (!xssMessage.__html && children) {
    return children;
  }

  return (
    <div aria-label={ariaLabel} className={className}>
      <div dangerouslySetInnerHTML={xssMessage} />
    </div>
  );
};

MyComponentXSS.displayName = 'MyComponentXSS';

export { MyComponentXSS as MyComponent };

// Test for the component
import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders the XSS-sanitized message', () => {
    const message = '<script>alert("XSS Attack!");</script>';
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the children when no message is provided', () => {
    const children = <div>Hello, World!</div>;
    const { container } = render(<MyComponent>{children}</MyComponent>);
    expect(container.firstChild).toEqual(children);
  });
});

import React, { FC, useMemo, PropsWithChildren } from 'react';
import ReactXSS from 'react-xss';

type Props = PropsWithChildren & {
  message?: string;
  ariaLabel?: string;
  className?: string;
};

type XSSFC<P> = FC<P> & {
  errorComponent?: React.ReactNode;
};

declare module 'react' {
  interface HTMLAttributes<T> {
    dangerouslySetInnerHTML?: { __html: string };
    ariaLabel?: string;
  }

  type FC<P> = XSSFC<P>;
}

const MyComponent: XSSFC<Props> = ({ children, message, ariaLabel, className }) => {
  const MemoizedMyComponent = useMemo(() => MyComponent, []);

  const xssMessage = useMemo(() => {
    if (message) {
      try {
        return ReactXSS.html(message);
      } catch {
        return { __html: '<div>Error: XSS sanitization failed.</div>' };
      }
    }
    return {};
  }, [message]);

  if (!xssMessage.__html && children) {
    return children;
  }

  return (
    <div aria-label={ariaLabel} className={className}>
      <div dangerouslySetInnerHTML={xssMessage} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  ariaLabel: 'MyComponent',
};

MyComponent.errorComponent = () => <div>Error: Invalid or malicious content detected.</div>;

MyComponent.displayName = 'MyComponent';

// Use XSS-sanitized version of React for user-generated content
const XSSReact = ReactXSS(React);

// Use XSS-sanitized version of FC for user-generated content
const XSSFC = XSSReact.FC as XSSFC;

const MyComponentXSS: XSSFC<Props> = ({ children, message, ariaLabel, className }) => {
  const xssMessage = useMemo(() => {
    if (message) {
      try {
        return XSSReact.html(message);
      } catch {
        return { __html: '<div>Error: XSS sanitization failed.</div>' };
      }
    }
    return {};
  }, [message]);

  if (!xssMessage.__html && children) {
    return children;
  }

  return (
    <div aria-label={ariaLabel} className={className}>
      <div dangerouslySetInnerHTML={xssMessage} />
    </div>
  );
};

MyComponentXSS.displayName = 'MyComponentXSS';

export { MyComponentXSS as MyComponent };

// Test for the component
import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders the XSS-sanitized message', () => {
    const message = '<script>alert("XSS Attack!");</script>';
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the children when no message is provided', () => {
    const children = <div>Hello, World!</div>;
    const { container } = render(<MyComponent>{children}</MyComponent>);
    expect(container.firstChild).toEqual(children);
  });
});