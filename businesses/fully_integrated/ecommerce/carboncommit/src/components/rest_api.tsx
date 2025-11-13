import React, { PropsWithChildren, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { DefaultHTMLProps, HTMLAttributes } from 'react';

// Import the DOMPurify sanitize function
import * as sanitize from 'dompurify/sanitize';

// Define the Props interface
interface Props extends DefaultHTMLProps<HTMLDivElement> {
  apiUrl: string;
  className?: string;
}

// Define the RestApi component
const RestApi: React.FC<Props> = ({ apiUrl, children, className, ...rest }) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Use the useEffect hook to fetch data from the API and sanitize it
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.text();
        const sanitizedData = sanitize(data);
        if (divRef.current) {
          divRef.current.innerHTML = sanitizedData;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div ref={divRef} {...rest} className={className}>
      {children}
    </div>
  );
};

// Export the RestApi component as a named export
export { RestApi };

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { DefaultHTMLProps, HTMLAttributes } from 'react';

// Import the DOMPurify sanitize function
import * as sanitize from 'dompurify/sanitize';

// Define the Props interface
interface Props extends DefaultHTMLProps<HTMLDivElement> {
  apiUrl: string;
  className?: string;
}

// Define the RestApi component
const RestApi: React.FC<Props> = ({ apiUrl, children, className, ...rest }) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Use the useEffect hook to fetch data from the API and sanitize it
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.text();
        const sanitizedData = sanitize(data);
        if (divRef.current) {
          divRef.current.innerHTML = sanitizedData;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div ref={divRef} {...rest} className={className}>
      {children}
    </div>
  );
};

// Export the RestApi component as a named export
export { RestApi };

Or using yarn:

Now, here's the updated code for the `RestApi.tsx` component: