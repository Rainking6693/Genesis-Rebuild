import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  message: string;
  fallback?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, fallback }) => {
  const [content, setContent] = useState(fallback);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setContent(message || fallback);
    }
  }, [message, fallback]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div ref={divRef} aria-label="Dynamic content container">
      {content}
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error in MyComponent:', error);
};

interface PropsWithChildren extends Props {
  children?: ReactNode;
}

const MyComponentWithChildren: FC<PropsWithChildren> = ({
  message,
  children,
}) => {
  const [content, setContent] = useState(message || '');
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setContent(message || '');
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div ref={divRef}>
      {children}
      {!children && content && (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
};

export { MyComponent, MyComponentWithChildren };

import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  message: string;
  fallback?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, fallback }) => {
  const [content, setContent] = useState(fallback);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setContent(message || fallback);
    }
  }, [message, fallback]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div ref={divRef} aria-label="Dynamic content container">
      {content}
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error in MyComponent:', error);
};

interface PropsWithChildren extends Props {
  children?: ReactNode;
}

const MyComponentWithChildren: FC<PropsWithChildren> = ({
  message,
  children,
}) => {
  const [content, setContent] = useState(message || '');
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setContent(message || '');
    }
  }, [message]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div ref={divRef}>
      {children}
      {!children && content && (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
};

export { MyComponent, MyComponentWithChildren };