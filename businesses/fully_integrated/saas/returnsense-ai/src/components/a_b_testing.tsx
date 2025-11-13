import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '../../hooks/useA_B_Testing';

interface Props {
  messageControl: string;
  messageTest: string;
  messageError: string;
  ariaLabelControl?: string;
  ariaLabelTest?: string;
}

const FunctionalComponent: React.FC<Props> = ({
  messageControl,
  messageTest,
  messageError,
  ariaLabelControl = 'Control message',
  ariaLabelTest = 'Test message',
}) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleAbbTestingError = (error: Error) => {
    setError(error);
    console.error('Error fetching A/B test variant:', error);
  };

  const fetchVariant = async () => {
    try {
      const result = await useA/BTesting('return-sense-ai-return-prediction-test');
      setVariant(result);
    } catch (error) {
      handleAbbTestingError(error);
    }
  };

  useEffect(() => {
    fetchVariant();
  }, []);

  if (error) {
    return <div role="alert">{messageError}</div>;
  }

  if (variant === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div aria-label={ariaLabelControl}>
        {variant === 'control' ? (
          <div>{messageControl}</div>
        ) : (
          <div role="button" tabIndex={0} onClick={() => alert(`You selected the test variant: ${variant}`)}>
            {messageTest}
          </div>
        )}
      </div>
      {variant && <div id="ab-test-variant">{variant}</div>}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  messageControl: 'Control',
  messageTest: 'Test',
  messageError: 'An error occurred while fetching the A/B test variant.',
};

export default FunctionalComponent;

import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '../../hooks/useA_B_Testing';

interface Props {
  messageControl: string;
  messageTest: string;
  messageError: string;
  ariaLabelControl?: string;
  ariaLabelTest?: string;
}

const FunctionalComponent: React.FC<Props> = ({
  messageControl,
  messageTest,
  messageError,
  ariaLabelControl = 'Control message',
  ariaLabelTest = 'Test message',
}) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleAbbTestingError = (error: Error) => {
    setError(error);
    console.error('Error fetching A/B test variant:', error);
  };

  const fetchVariant = async () => {
    try {
      const result = await useA/BTesting('return-sense-ai-return-prediction-test');
      setVariant(result);
    } catch (error) {
      handleAbbTestingError(error);
    }
  };

  useEffect(() => {
    fetchVariant();
  }, []);

  if (error) {
    return <div role="alert">{messageError}</div>;
  }

  if (variant === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div aria-label={ariaLabelControl}>
        {variant === 'control' ? (
          <div>{messageControl}</div>
        ) : (
          <div role="button" tabIndex={0} onClick={() => alert(`You selected the test variant: ${variant}`)}>
            {messageTest}
          </div>
        )}
      </div>
      {variant && <div id="ab-test-variant">{variant}</div>}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  messageControl: 'Control',
  messageTest: 'Test',
  messageError: 'An error occurred while fetching the A/B test variant.',
};

export default FunctionalComponent;