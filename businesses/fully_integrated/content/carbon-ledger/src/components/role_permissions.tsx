import React, { useState, useEffect, useCallback, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AccessibilityAttributes } from './types';

interface MyComponentProps extends AccessibilityAttributes {
  title: string;
  content: string;
  isAdmin?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    isAdmin = false,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
  }) => {
    const [id, setId] = useState<string>('');

    const generateUniqueId = useCallback(() => {
      try {
        return uuidv4();
      } catch (error) {
        console.error('Error generating unique ID:', error);
        return `my-component-${Date.now()}`;
      }
    }, []);

    useEffect(() => {
      setId(generateUniqueId());
    }, [generateUniqueId]);

    return (
      <div
        data-testid={`my-component-${id}`}
        aria-label={ariaLabel || title}
        aria-describedby={ariaDescribedBy}
      >
        <h1>{title}</h1>
        <p>{content}</p>
        {isAdmin && (
          <div data-testid="admin-actions">
            <button aria-label="Edit" disabled={!isAdmin}>
              Edit
            </button>
            <button aria-label="Delete" disabled={!isAdmin}>
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default MyComponent;

import React, { useState, useEffect, useCallback, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AccessibilityAttributes } from './types';

interface MyComponentProps extends AccessibilityAttributes {
  title: string;
  content: string;
  isAdmin?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    isAdmin = false,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
  }) => {
    const [id, setId] = useState<string>('');

    const generateUniqueId = useCallback(() => {
      try {
        return uuidv4();
      } catch (error) {
        console.error('Error generating unique ID:', error);
        return `my-component-${Date.now()}`;
      }
    }, []);

    useEffect(() => {
      setId(generateUniqueId());
    }, [generateUniqueId]);

    return (
      <div
        data-testid={`my-component-${id}`}
        aria-label={ariaLabel || title}
        aria-describedby={ariaDescribedBy}
      >
        <h1>{title}</h1>
        <p>{content}</p>
        {isAdmin && (
          <div data-testid="admin-actions">
            <button aria-label="Edit" disabled={!isAdmin}>
              Edit
            </button>
            <button aria-label="Delete" disabled={!isAdmin}>
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default MyComponent;