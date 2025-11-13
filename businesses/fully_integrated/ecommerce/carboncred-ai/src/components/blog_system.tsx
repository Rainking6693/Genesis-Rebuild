import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { sanitizeUserInput } from '../../security/input-sanitization';

interface Project {
  id: number;
  name: string;
  description: string;
}

interface Props {
  message: string;
}

interface UseCarbonCreditProjectsOptions {
  onError: (error: Error) => void;
}

const useCarbonCreditProjects = (options: UseCarbonCreditProjectsOptions) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let error: Error | null = null;

      try {
        const response = await fetch('https://api.carboncred.ai/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error_) {
        error = error_ as Error;
      }

      if (error) {
        options.onError(error);
      }
    };

    fetchData();
  }, [options.onError]);

  return projects;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: Error) => {
    setError(error.message);
  };

  const projects = useCarbonCreditProjects({ onError: handleError });

  return (
    <div>
      {error && <div role="alert">{error}</div>}
      {message && (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizeUserInput(message) }}
        />
      )}
      {/* Display carbon credit projects */}
      {projects.map((project) => (
        <div key={project.id}>
          {project.name} - {project.description}
        </div>
      ))}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { sanitizeUserInput } from '../../security/input-sanitization';

interface Project {
  id: number;
  name: string;
  description: string;
}

interface Props {
  message: string;
}

interface UseCarbonCreditProjectsOptions {
  onError: (error: Error) => void;
}

const useCarbonCreditProjects = (options: UseCarbonCreditProjectsOptions) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let error: Error | null = null;

      try {
        const response = await fetch('https://api.carboncred.ai/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error_) {
        error = error_ as Error;
      }

      if (error) {
        options.onError(error);
      }
    };

    fetchData();
  }, [options.onError]);

  return projects;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: Error) => {
    setError(error.message);
  };

  const projects = useCarbonCreditProjects({ onError: handleError });

  return (
    <div>
      {error && <div role="alert">{error}</div>}
      {message && (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizeUserInput(message) }}
        />
      )}
      {/* Display carbon credit projects */}
      {projects.map((project) => (
        <div key={project.id}>
          {project.name} - {project.description}
        </div>
      ))}
    </div>
  );
};

export default MyComponent;