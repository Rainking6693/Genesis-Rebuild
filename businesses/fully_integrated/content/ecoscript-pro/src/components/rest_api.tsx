import React, { FC, useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

interface AppContextData {
  isProduction: boolean;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { isProduction } = useContext(AppContext);
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (isProduction) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } else {
      setSanitizedMessage(message);
    }
  }, [isProduction, message]);

  return (
    <>
      <div id="my-component-message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      <div id="my-component-message-plaintext">{sanitizedMessage}</div>
    </>
  );
};

// Importing React only once for better performance
import React from 'react';

// Using FC for functional components with props for better type safety and IDE support
type ComponentType = FC<Props>;

// Defining a constant for the component name for easier debugging and maintenance
const EcoScriptProComponent: ComponentType = MyComponent;

export default EcoScriptProComponent;

import React, { FC, useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

interface AppContextData {
  isProduction: boolean;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { isProduction } = useContext(AppContext);
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    if (isProduction) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } else {
      setSanitizedMessage(message);
    }
  }, [isProduction, message]);

  return (
    <>
      <div id="my-component-message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      <div id="my-component-message-plaintext">{sanitizedMessage}</div>
    </>
  );
};

// Importing React only once for better performance
import React from 'react';

// Using FC for functional components with props for better type safety and IDE support
type ComponentType = FC<Props>;

// Defining a constant for the component name for easier debugging and maintenance
const EcoScriptProComponent: ComponentType = MyComponent;

export default EcoScriptProComponent;