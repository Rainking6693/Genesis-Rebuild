import React, { useEffect, useState } from 'react';

interface Props {
  message: string;
}

interface UsageData {
  // Define the structure of the usage data here
}

const UsageAnalytics: FC<Props> = (props: Props) => {
  const [error, setError] = useState<Error | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const handleError = (error: Error) => {
      if (isMounted) {
        setError(error);
        console.error('Error in UsageAnalytics:', error);
      }
    };

    const parseUsageData = async () => {
      try {
        const parsedData = await parseUsageDataFromMessage(props.message, handleError);
        if (isMounted) {
          setUsageData(parsedData);
        }
      } catch (error) {
        handleError(error);
      }
    };

    const sendUsageDataToServer = async (usageData: UsageData) => {
      try {
        const response = await sendUsageDataToServerImpl(usageData, handleError);
        if (isMounted && isDataSentSuccessfully(response)) {
          // You can optionally clear the usage data here if it was sent successfully
          setUsageData(null);
        }
      } catch (error) {
        handleError(error);
      }
    };

    parseUsageData();
    return () => { isMounted = false; };
  }, [props.message]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!usageData) {
    return <div>Loading usage data...</div>;
  }

  // Render the usage data here
  return <div>{/* ... */}</div>;
};

// Define a separate function for parsing usage data
const parseUsageDataFromMessage = async (message: string, onError: (error: Error) => void) => {
  // Implement a robust parsing algorithm that can handle various formats of usage data
  // ...

  if (!isValidUsageData(usageData)) {
    onError(new Error('Invalid usage data'));
  }

  return usageData;
};

// Define a separate function for sending usage data to the server
const sendUsageDataToServerImpl = async (usageData: UsageData, onError: (error: Error) => void) => {
  // Implement secure data transmission using HTTPS and proper authentication
  // ...

  return new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/usage');
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`HTTP error ${xhr.status}: ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => {
      reject(new Error('Network error'));
    };
    xhr.send(JSON.stringify(usageData));
  });
};

// Add utility functions for checking the validity of usage data and data transmission
const isValidUsageData = (usageData: UsageData) => {
  // Implement a function to check if the usage data is valid
  // ...
};

const isDataSentSuccessfully = (response: Response) => {
  // Implement a function to check if the data was sent successfully
  // ...
};

export default UsageAnalytics;

In this updated code, I've added state to store the error and usage data, and I've separated the parsing and sending logic into separate functions. I've also used a Promise to handle the asynchronous sending of usage data to the server. This makes the code more resilient, maintainable, and easier to test. Additionally, I've added conditional rendering to display error messages and loading states.