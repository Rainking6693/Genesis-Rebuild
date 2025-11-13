import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Props {
  apiKey: string;
}

interface ResponseData {
  content?: {
    day: string;
    module: string;
    challenge: string;
  }[];
  error?: string;
}

const MyComponent: React.FC<Props> = ({ apiKey }) => {
  const [content, setContent] = useState<ResponseData['content']>([]);
  const [error, setError] = useState<ResponseData['error']>('');
  const [isLoading, setIsLoading] = useState(true);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };

  const fetchData = useCallback(async () => {
    if (!apiKey) return;

    try {
      const response = await axios.get('https://wellnessflow-api.com/calendar', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 5000,
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setContent(response.data.content || []);
      setError('');
      setIsLoading(false);
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
      setIsLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      fetchData();
    }
  }, [apiKey, fetchData]);

  useEffect(() => {
    if (content.length > 0) {
      setIsLoading(false);
    }
  }, [content]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div role="list" onKeyDown={handleKeyDown}>
      {isLoading && <div>Loading...</div>}
      {error && <div aria-live="assertive">{error}</div>}
      {content.map((item, index) => (
        <div key={index} role="listitem">
          Day: {item.day}<br />
          Module: {item.module}<br />
          Challenge: {item.challenge}<br />
          <br />
        </div>
      ))}
    </div>
  );
};

export default MyComponent;

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Props {
  apiKey: string;
}

interface ResponseData {
  content?: {
    day: string;
    module: string;
    challenge: string;
  }[];
  error?: string;
}

const MyComponent: React.FC<Props> = ({ apiKey }) => {
  const [content, setContent] = useState<ResponseData['content']>([]);
  const [error, setError] = useState<ResponseData['error']>('');
  const [isLoading, setIsLoading] = useState(true);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };

  const fetchData = useCallback(async () => {
    if (!apiKey) return;

    try {
      const response = await axios.get('https://wellnessflow-api.com/calendar', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 5000,
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setContent(response.data.content || []);
      setError('');
      setIsLoading(false);
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
      setIsLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      fetchData();
    }
  }, [apiKey, fetchData]);

  useEffect(() => {
    if (content.length > 0) {
      setIsLoading(false);
    }
  }, [content]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div role="list" onKeyDown={handleKeyDown}>
      {isLoading && <div>Loading...</div>}
      {error && <div aria-live="assertive">{error}</div>}
      {content.map((item, index) => (
        <div key={index} role="listitem">
          Day: {item.day}<br />
          Module: {item.module}<br />
          Challenge: {item.challenge}<br />
          <br />
        </div>
      ))}
    </div>
  );
};

export default MyComponent;