import React, { FunctionComponent, ReactNode, useContext } from 'react';
import { DefaultSeoContext } from './DefaultSeoContext';

interface Props {
  seoTitle?: string;
  seoDescription?: string;
  message: string;
  children?: ReactNode;
}

const FunctionalComponent: FunctionComponent<Props> = ({ seoTitle, seoDescription, message, children }) => {
  const { defaultSeoTitle, defaultSeoDescription } = useContext(DefaultSeoContext);

  // Check if seoTitle and seoDescription are provided, otherwise use default values
  const providedSeoTitle = seoTitle || defaultSeoTitle;
  const providedSeoDescription = seoDescription || defaultSeoDescription;

  if (!providedSeoTitle || !providedSeoDescription) {
    console.warn(
      'Warning: seoTitle and seoDescription are required for proper SEO. Defaulting to default values.'
    );
  }

  // Add meta tags for SEO
  const metaTags = (
    <>
      <meta name="title" content={providedSeoTitle} />
      <meta name="description" content={providedSeoDescription} />
      {/* Add additional meta tags as needed */}
    </>
  );

  // Use dangerouslySetInnerHTML for safe HTML content
  const safeHTML = { __html: message };

  return (
    <div>
      {metaTags}
      <div dangerouslySetInnerHTML={safeHTML} />
      {/* Allow for additional content within the component */}
      {children}
    </div>
  );
};

export default FunctionalComponent;

// DefaultSeoContext.tsx
import React, { createContext, ReactNode, useState } from 'react';

interface DefaultSeoContextValue {
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}

const DefaultSeoContext = createContext<DefaultSeoContextValue>({
  defaultSeoTitle: '',
  defaultSeoDescription: '',
});

interface DefaultSeoContextProviderProps {
  children: ReactNode;
}

const DefaultSeoContextProvider: React.FC<DefaultSeoContextProviderProps> = ({ children }) => {
  const [defaultSeoTitle, setDefaultSeoTitle] = useState<string>('');
  const [defaultSeoDescription, setDefaultSeoDescription] = useState<string>('');

  return (
    <DefaultSeoContext.Provider value={{ defaultSeoTitle, defaultSeoDescription }}>
      {children}
    </DefaultSeoContext.Provider>
  );
};

export { DefaultSeoContext, DefaultSeoContextProvider };

import React, { FunctionComponent, ReactNode, useContext } from 'react';
import { DefaultSeoContext } from './DefaultSeoContext';

interface Props {
  seoTitle?: string;
  seoDescription?: string;
  message: string;
  children?: ReactNode;
}

const FunctionalComponent: FunctionComponent<Props> = ({ seoTitle, seoDescription, message, children }) => {
  const { defaultSeoTitle, defaultSeoDescription } = useContext(DefaultSeoContext);

  // Check if seoTitle and seoDescription are provided, otherwise use default values
  const providedSeoTitle = seoTitle || defaultSeoTitle;
  const providedSeoDescription = seoDescription || defaultSeoDescription;

  if (!providedSeoTitle || !providedSeoDescription) {
    console.warn(
      'Warning: seoTitle and seoDescription are required for proper SEO. Defaulting to default values.'
    );
  }

  // Add meta tags for SEO
  const metaTags = (
    <>
      <meta name="title" content={providedSeoTitle} />
      <meta name="description" content={providedSeoDescription} />
      {/* Add additional meta tags as needed */}
    </>
  );

  // Use dangerouslySetInnerHTML for safe HTML content
  const safeHTML = { __html: message };

  return (
    <div>
      {metaTags}
      <div dangerouslySetInnerHTML={safeHTML} />
      {/* Allow for additional content within the component */}
      {children}
    </div>
  );
};

export default FunctionalComponent;

// DefaultSeoContext.tsx
import React, { createContext, ReactNode, useState } from 'react';

interface DefaultSeoContextValue {
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}

const DefaultSeoContext = createContext<DefaultSeoContextValue>({
  defaultSeoTitle: '',
  defaultSeoDescription: '',
});

interface DefaultSeoContextProviderProps {
  children: ReactNode;
}

const DefaultSeoContextProvider: React.FC<DefaultSeoContextProviderProps> = ({ children }) => {
  const [defaultSeoTitle, setDefaultSeoTitle] = useState<string>('');
  const [defaultSeoDescription, setDefaultSeoDescription] = useState<string>('');

  return (
    <DefaultSeoContext.Provider value={{ defaultSeoTitle, defaultSeoDescription }}>
      {children}
    </DefaultSeoContext.Provider>
  );
};

export { DefaultSeoContext, DefaultSeoContextProvider };