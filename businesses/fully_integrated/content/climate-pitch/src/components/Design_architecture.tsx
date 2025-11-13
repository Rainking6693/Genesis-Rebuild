import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message: string;
  data?: any;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  // Adding aria-label for accessibility
  const ariaLabel = children ? children.toString() : '';

  return (
    <div
      dangerouslySetInnerHTML={{ __html: message }}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

const validateData = (data: any): { message: string; error?: string } => {
  let message = '';
  let error: string | undefined;

  // Add your validation logic here
  // For example, let's check if the data is an object and has required properties
  if (!data) {
    error = 'Invalid data format. Data should not be null or undefined.';
  } else if (
    !data.climateData ||
    !data.carbonImpact ||
    typeof data.climateData !== 'object' ||
    typeof data.carbonImpact !== 'object' ||
    !data.climateData ||
    !Object.keys(data.climateData).length ||
    !data.carbonImpact ||
    !Object.keys(data.carbonImpact).length
  ) {
    error = 'Invalid data format. Data should contain climateData and carbonImpact properties, which should be non-empty objects.';
  }

  if (error) {
    message = error;
  } else {
    message = JSON.stringify(data, null, 2); // Formatting the data for display
  }

  return { message, error };
};

const MyComponentWithData = (props: Props) => {
  const [validatedData, setValidatedData] = useState({ message: '', error: '' });

  useEffect(() => {
    const { message, error } = validateData(props.data);
    setValidatedData({ message, error });
  }, [props.data]);

  // Check for the presence of children before rendering them
  const childrenToRender = props.children && <>{props.children}</>;

  return (
    <MyComponent message={validatedData.message} data={props.data}>
      {validatedData.error && <div>{validatedData.error}</div>}
      {childrenToRender}
      {validatedData.message && (
        <pre>{validatedData.message}</pre>
      )}
    </MyComponent>
  );
};

// Use React.memo for performance optimization
const MemoizedMyComponentWithData = React.memo(MyComponentWithData);

export default MemoizedMyComponentWithData;

import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message: string;
  data?: any;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  // Adding aria-label for accessibility
  const ariaLabel = children ? children.toString() : '';

  return (
    <div
      dangerouslySetInnerHTML={{ __html: message }}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

const validateData = (data: any): { message: string; error?: string } => {
  let message = '';
  let error: string | undefined;

  // Add your validation logic here
  // For example, let's check if the data is an object and has required properties
  if (!data) {
    error = 'Invalid data format. Data should not be null or undefined.';
  } else if (
    !data.climateData ||
    !data.carbonImpact ||
    typeof data.climateData !== 'object' ||
    typeof data.carbonImpact !== 'object' ||
    !data.climateData ||
    !Object.keys(data.climateData).length ||
    !data.carbonImpact ||
    !Object.keys(data.carbonImpact).length
  ) {
    error = 'Invalid data format. Data should contain climateData and carbonImpact properties, which should be non-empty objects.';
  }

  if (error) {
    message = error;
  } else {
    message = JSON.stringify(data, null, 2); // Formatting the data for display
  }

  return { message, error };
};

const MyComponentWithData = (props: Props) => {
  const [validatedData, setValidatedData] = useState({ message: '', error: '' });

  useEffect(() => {
    const { message, error } = validateData(props.data);
    setValidatedData({ message, error });
  }, [props.data]);

  // Check for the presence of children before rendering them
  const childrenToRender = props.children && <>{props.children}</>;

  return (
    <MyComponent message={validatedData.message} data={props.data}>
      {validatedData.error && <div>{validatedData.error}</div>}
      {childrenToRender}
      {validatedData.message && (
        <pre>{validatedData.message}</pre>
      )}
    </MyComponent>
  );
};

// Use React.memo for performance optimization
const MemoizedMyComponentWithData = React.memo(MyComponentWithData);

export default MemoizedMyComponentWithData;