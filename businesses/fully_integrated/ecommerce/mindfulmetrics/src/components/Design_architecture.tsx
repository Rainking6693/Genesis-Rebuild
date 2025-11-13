import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MicroInterventionProps {
  title: string;
  content: string;
  duration: number;
}

const MicroIntervention: React.FC<MicroInterventionProps> = ({ title, content, duration }) => {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setIsActive(false);
    }, duration * 1000);
  }, [duration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    return stopTimer;
  }, [isActive, startTimer, stopTimer]);

  const handleClick = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <div className={`micro-intervention ${isActive ? 'active' : ''}`}>
      <h3>{title}</h3>
      <p>{content}</p>
      <button onClick={handleClick} aria-label={isActive ? 'Stop' : 'Start'}>
        {isActive ? 'Active' : 'Start'}
      </button>
    </div>
  );
};

const MindfulMetrics: React.FC = () => {
  const [microInterventions, setMicroInterventions] = useState<MicroInterventionProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMicroInterventions = useCallback(async () => {
    try {
      const response: AxiosResponse<MicroInterventionProps[]> = await axios.get('/api/micro-interventions');
      setMicroInterventions(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching micro-interventions: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    fetchMicroInterventions();
  }, [fetchMicroInterventions]);

  return (
    <div className="mindful-metrics">
      <h1>MindfulMetrics</h1>
      {error && <div className="error" role="alert">{error}</div>}
      <div className="micro-interventions" aria-live="polite">
        {microInterventions.map((intervention, index) => (
          <MicroIntervention
            key={index}
            title={intervention.title}
            content={intervention.content}
            duration={intervention.duration}
          />
        ))}
      </div>
    </div>
  );
};

export default MindfulMetrics;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MicroInterventionProps {
  title: string;
  content: string;
  duration: number;
}

const MicroIntervention: React.FC<MicroInterventionProps> = ({ title, content, duration }) => {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setIsActive(false);
    }, duration * 1000);
  }, [duration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    return stopTimer;
  }, [isActive, startTimer, stopTimer]);

  const handleClick = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <div className={`micro-intervention ${isActive ? 'active' : ''}`}>
      <h3>{title}</h3>
      <p>{content}</p>
      <button onClick={handleClick} aria-label={isActive ? 'Stop' : 'Start'}>
        {isActive ? 'Active' : 'Start'}
      </button>
    </div>
  );
};

const MindfulMetrics: React.FC = () => {
  const [microInterventions, setMicroInterventions] = useState<MicroInterventionProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMicroInterventions = useCallback(async () => {
    try {
      const response: AxiosResponse<MicroInterventionProps[]> = await axios.get('/api/micro-interventions');
      setMicroInterventions(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching micro-interventions: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    fetchMicroInterventions();
  }, [fetchMicroInterventions]);

  return (
    <div className="mindful-metrics">
      <h1>MindfulMetrics</h1>
      {error && <div className="error" role="alert">{error}</div>}
      <div className="micro-interventions" aria-live="polite">
        {microInterventions.map((intervention, index) => (
          <MicroIntervention
            key={index}
            title={intervention.title}
            content={intervention.content}
            duration={intervention.duration}
          />
        ))}
      </div>
    </div>
  );
};

export default MindfulMetrics;