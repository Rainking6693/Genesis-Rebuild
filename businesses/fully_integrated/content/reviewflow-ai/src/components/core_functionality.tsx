// sentiment-analyzer.ts
import sentimental from 'sentiment';

interface SentimentResult {
  score: number;
  positive: number;
  neutral: number;
  negative: number;
}

const analyzer = new sentimental();

export const analyze = (feedback: string): SentimentResult => {
  const result = analyzer.analyze(feedback);

  if (!result || !result.score) {
    throw new Error('Sentiment analysis failed');
  }

  return result;
};

// ReviewFlowAIResponse.tsx
import React, { FC, ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { analyze } from './sentiment-analyzer';

interface Props {
  message: string;
}

interface SentimentResult {
  score: number;
  positive: number;
  neutral: number;
  negative: number;
}

const generateReviewResponse = async (feedback: string): Promise<ReactNode> => {
  let response: ReactNode;

  try {
    const sentimentResult = await analyze(feedback);

    if (sentimentResult.score > 0) {
      response = (
        <>
          Positive feedback received! Thank you for your kind words.
        </>
      );
    } else if (sentimentResult.score < 0) {
      response = (
        <>
          We're sorry to hear about your concerns. Our team will review your feedback and work on improvements.
        </>
      );
    } else {
      response = <>Your feedback is neutral. We appreciate your time and effort.</>;
    }
  } catch (error) {
    response = (
      <>
        We're sorry, but there was an error processing your feedback. Please try again later.
      </>
    );
  }

  return response;
};

const ReviewFlowAIResponse: FC<Props> = ({ message }) => {
  const [personalizedResponse, setPersonalizedResponse] = useState<ReactNode>(null);

  useEffect(() => {
    const updateResponse = async () => {
      const newResponse = await generateReviewResponse(message);
      setPersonalizedResponse(newResponse);
    };

    if (message) {
      updateResponse();
    }
  }, [message]);

  // Add accessibility by providing an ARIA live region for the response
  return (
    <div>
      <div aria-label="AI generated review response" role="status">
        {personalizedResponse}
      </div>
    </div>
  );
};

ReviewFlowAIResponse.defaultProps = {
  message: '',
};

ReviewFlowAIResponse.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ReviewFlowAIResponse;

// sentiment-analyzer.ts
import sentimental from 'sentiment';

interface SentimentResult {
  score: number;
  positive: number;
  neutral: number;
  negative: number;
}

const analyzer = new sentimental();

export const analyze = (feedback: string): SentimentResult => {
  const result = analyzer.analyze(feedback);

  if (!result || !result.score) {
    throw new Error('Sentiment analysis failed');
  }

  return result;
};

// ReviewFlowAIResponse.tsx
import React, { FC, ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { analyze } from './sentiment-analyzer';

interface Props {
  message: string;
}

interface SentimentResult {
  score: number;
  positive: number;
  neutral: number;
  negative: number;
}

const generateReviewResponse = async (feedback: string): Promise<ReactNode> => {
  let response: ReactNode;

  try {
    const sentimentResult = await analyze(feedback);

    if (sentimentResult.score > 0) {
      response = (
        <>
          Positive feedback received! Thank you for your kind words.
        </>
      );
    } else if (sentimentResult.score < 0) {
      response = (
        <>
          We're sorry to hear about your concerns. Our team will review your feedback and work on improvements.
        </>
      );
    } else {
      response = <>Your feedback is neutral. We appreciate your time and effort.</>;
    }
  } catch (error) {
    response = (
      <>
        We're sorry, but there was an error processing your feedback. Please try again later.
      </>
    );
  }

  return response;
};

const ReviewFlowAIResponse: FC<Props> = ({ message }) => {
  const [personalizedResponse, setPersonalizedResponse] = useState<ReactNode>(null);

  useEffect(() => {
    const updateResponse = async () => {
      const newResponse = await generateReviewResponse(message);
      setPersonalizedResponse(newResponse);
    };

    if (message) {
      updateResponse();
    }
  }, [message]);

  // Add accessibility by providing an ARIA live region for the response
  return (
    <div>
      <div aria-label="AI generated review response" role="status">
        {personalizedResponse}
      </div>
    </div>
  );
};

ReviewFlowAIResponse.defaultProps = {
  message: '',
};

ReviewFlowAIResponse.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ReviewFlowAIResponse;