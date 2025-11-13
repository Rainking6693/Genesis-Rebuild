import React, { useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';

type ESGScore = number | null;

interface Props {
  message: string;
  esgScore?: ESGScore;
}

const useESGScoring = () => {
  const [esgScore, setESGScore] = useState<ESGScore>(null);

  useEffect(() => {
    const fetchESGScore = async () => {
      try {
        const response = await fetch('/api/esg-score'); // Fetch ESG score asynchronously
        const data = await response.ok ? await response.json() : { esgScore: null };
        setESGScore(data.esgScore);
      } catch (error) {
        console.error('Error fetching ESG score:', error);
        setESGScore(null);
      }
    };

    fetchESGScore();
  }, []);

  return { esgScore }; // Return ESG score for use in other components
};

const FunctionalComponent: React.FC<Props> = ({ message, esgScore }) => {
  const sanitizedMessage = sanitizeUserInput(message); // Sanitize user input for security

  // Add ARIA attributes for accessibility
  const messageContainerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.setAttribute('aria-label', 'User message');
    }
  }, [message]);

  // Handle edge case when ESG score is not available
  if (esgScore === null) {
    return (
      <div>
        <div ref={messageContainerRef} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <div>ESG Score: Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div ref={messageContainerRef} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {/* Display ESG score */}
      <div>ESG Score: {esgScore}</div>
    </div>
  );
};

// Use the custom hook in FunctionalComponent
const FunctionalComponentWithESG = (props: Props) => {
  const { esgScore } = useESGScoring();
  return <FunctionalComponent {...props} esgScore={esgScore} />;
};

export default FunctionalComponentWithESG;

import React, { useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';

type ESGScore = number | null;

interface Props {
  message: string;
  esgScore?: ESGScore;
}

const useESGScoring = () => {
  const [esgScore, setESGScore] = useState<ESGScore>(null);

  useEffect(() => {
    const fetchESGScore = async () => {
      try {
        const response = await fetch('/api/esg-score'); // Fetch ESG score asynchronously
        const data = await response.ok ? await response.json() : { esgScore: null };
        setESGScore(data.esgScore);
      } catch (error) {
        console.error('Error fetching ESG score:', error);
        setESGScore(null);
      }
    };

    fetchESGScore();
  }, []);

  return { esgScore }; // Return ESG score for use in other components
};

const FunctionalComponent: React.FC<Props> = ({ message, esgScore }) => {
  const sanitizedMessage = sanitizeUserInput(message); // Sanitize user input for security

  // Add ARIA attributes for accessibility
  const messageContainerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.setAttribute('aria-label', 'User message');
    }
  }, [message]);

  // Handle edge case when ESG score is not available
  if (esgScore === null) {
    return (
      <div>
        <div ref={messageContainerRef} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <div>ESG Score: Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div ref={messageContainerRef} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {/* Display ESG score */}
      <div>ESG Score: {esgScore}</div>
    </div>
  );
};

// Use the custom hook in FunctionalComponent
const FunctionalComponentWithESG = (props: Props) => {
  const { esgScore } = useESGScoring();
  return <FunctionalComponent {...props} esgScore={esgScore} />;
};

export default FunctionalComponentWithESG;