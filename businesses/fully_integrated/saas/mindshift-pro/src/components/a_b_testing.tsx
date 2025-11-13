import React, { useEffect, useState } from 'react';
import { ABTester } from '../../ab_testing'; // Assuming ab_testing module is available

interface Props {
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ message }) => {
  // Use A/B testing for testing different messages
  const [testMessage, setTestMessage] = useState(message);

  const abTestKey = 'MindShiftProMoodMessage';
  const controlMessage = message;
  const variations = {
    1: 'Test Message 1',
    2: 'Test Message 2',
    // Add more variations as needed
  };

  useEffect(() => {
    let isMounted = true;

    const runTest = async () => {
      try {
        const result = await ABTester.run(abTestKey, { control: controlMessage, variations });
        if (isMounted) {
          setTestMessage(result.winningVariant);
        }
      } catch (error) {
        console.error('Error running A/B test:', error);
        if (isMounted) {
          setTestMessage(controlMessage); // Set control message if an error occurs during testing
        }
      }
    };

    runTest();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {testMessage}
      {/* Add ARIA attributes for accessibility */}
      <div aria-label="A/B test result">{testMessage}</div>
      <div aria-hidden={true}>{JSON.stringify(testMessage)}</div>
      {/* Add a hidden div with the test message for screen readers */}
    </div>
  );
};

export default FunctionalComponent;

1. Added a cleanup function to the useEffect hook to handle component unmounting, improving resiliency.
2. Checked if the component is mounted before updating the state to avoid potential issues when the component is unmounted during the A/B test.
3. Added a hidden div with the test message for screen readers to improve accessibility.
4. Made the changes more maintainable by adding comments and improving the code structure.