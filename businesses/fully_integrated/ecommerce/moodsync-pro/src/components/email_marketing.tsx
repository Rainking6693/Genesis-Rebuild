import React, { useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useEmailTemplates } from '../hooks/useEmailTemplates';

interface Props {
  subject: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ subject, message }) => {
  const [emailTemplate, setEmailTemplate] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(message);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmailTemplates = async () => {
      try {
        const { emailTemplate, dynamicContent } = await useEmailTemplates(subject);
        if (emailTemplate && dynamicContent) {
          setEmailTemplate(emailTemplate);
          setDynamicContent(dynamicContent);
          setSanitizedMessage(`${emailTemplate} ${sanitizeUserInput(message)} ${dynamicContent}`);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setError(new Error(`Failed to fetch email templates for subject: ${subject}`));
        }
      } catch (error) {
        setIsLoading(false);
        setError(error);
      }
    };

    fetchEmailTemplates();
  }, [subject]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
    </div>
  );
};

export default FunctionalComponent;

import React, { useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useEmailTemplates } from '../hooks/useEmailTemplates';

interface Props {
  subject: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ subject, message }) => {
  const [emailTemplate, setEmailTemplate] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(message);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmailTemplates = async () => {
      try {
        const { emailTemplate, dynamicContent } = await useEmailTemplates(subject);
        if (emailTemplate && dynamicContent) {
          setEmailTemplate(emailTemplate);
          setDynamicContent(dynamicContent);
          setSanitizedMessage(`${emailTemplate} ${sanitizeUserInput(message)} ${dynamicContent}`);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setError(new Error(`Failed to fetch email templates for subject: ${subject}`));
        }
      } catch (error) {
        setIsLoading(false);
        setError(error);
      }
    };

    fetchEmailTemplates();
  }, [subject]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
    </div>
  );
};

export default FunctionalComponent;