import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { logEvent } from '@pitchstack/analytics';
import { getProspectData } from '@pitchstack/crm-integration';

type Props = {
  prospectId?: string;
};

const generatePersonalizedPitch = (prospectData: any): string => {
  // Implement your personalized pitch generation logic here
  return 'Your personalized pitch goes here';
};

const MyComponent: FC<Props> = ({ prospectId }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prospectId) {
      console.error('Missing required prop: prospectId');
      setMessage('Error: Missing required prop: prospectId');
      setLoading(false);
      return;
    }

    setLoading(true);

    getProspectData(prospectId)
      .then((prospectData) => {
        const pitch = generatePersonalizedPitch(prospectData);
        setMessage(pitch || 'Error: Unable to generate personalized pitch');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching prospect data:', error);
        setMessage('Error: Unable to fetch prospect data');
        setLoading(false);
      })
      .finally(() => {
        logEvent('Sales Pitch Deck Loaded', { prospectId });
      });
  }, [prospectId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {message && (
        <div data-testid="personalized-pitch">
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            aria-label={`Personalized sales pitch for prospect with ID ${prospectId}`}
          />
          {!message.includes('Error') && <div id="fallback-content">Fallback content</div>}
        </div>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  prospectId: '',
};

MyComponent.propTypes = {
  prospectId: PropTypes.string,
};

const MemoizedMyComponent = React.memo(MyComponent);

MemoizedMyComponent.getInitialProps = async ({ query }) => {
  const { prospectId } = query;
  return { prospectId };
};

export default MemoizedMyComponent;

import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { logEvent } from '@pitchstack/analytics';
import { getProspectData } from '@pitchstack/crm-integration';

type Props = {
  prospectId?: string;
};

const generatePersonalizedPitch = (prospectData: any): string => {
  // Implement your personalized pitch generation logic here
  return 'Your personalized pitch goes here';
};

const MyComponent: FC<Props> = ({ prospectId }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prospectId) {
      console.error('Missing required prop: prospectId');
      setMessage('Error: Missing required prop: prospectId');
      setLoading(false);
      return;
    }

    setLoading(true);

    getProspectData(prospectId)
      .then((prospectData) => {
        const pitch = generatePersonalizedPitch(prospectData);
        setMessage(pitch || 'Error: Unable to generate personalized pitch');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching prospect data:', error);
        setMessage('Error: Unable to fetch prospect data');
        setLoading(false);
      })
      .finally(() => {
        logEvent('Sales Pitch Deck Loaded', { prospectId });
      });
  }, [prospectId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {message && (
        <div data-testid="personalized-pitch">
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            aria-label={`Personalized sales pitch for prospect with ID ${prospectId}`}
          />
          {!message.includes('Error') && <div id="fallback-content">Fallback content</div>}
        </div>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  prospectId: '',
};

MyComponent.propTypes = {
  prospectId: PropTypes.string,
};

const MemoizedMyComponent = React.memo(MyComponent);

MemoizedMyComponent.getInitialProps = async ({ query }) => {
  const { prospectId } = query;
  return { prospectId };
};

export default MemoizedMyComponent;