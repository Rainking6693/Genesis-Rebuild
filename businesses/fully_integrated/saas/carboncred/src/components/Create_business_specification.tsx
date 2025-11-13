import React, { useEffect, useState } from 'react';

interface ApiResponse {
  carbonFootprint: number;
  carbonCredits: number;
}

interface Props {
  apiKey: string;
  businessName: string;
}

interface State {
  loading: boolean;
  data: ApiResponse | null;
  error: string | null;
}

const MyComponent: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const validateApiKey = (apiKey: string) => {
    if (!apiKey || apiKey.length === 0) {
      throw new Error('API key is required');
    }
    return apiKey;
  };

  const fetchData = async () => {
    try {
      const apiKey = validateApiKey(props.apiKey);
      const response = await fetch(`https://api.carboncred.com/v1/business/${props.businessName}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as ApiResponse;
      setState({ loading: false, data, error: null });
    } catch (error) {
      setState({ loading: false, data: null, error: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.apiKey, props.businessName]);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return (
      <div>
        <div role="alert" aria-label="Error">
          {state.error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 aria-label="Carbon Footprint">Carbon Footprint:</h2>
      <span>{state.data?.carbonFootprint || 'N/A'}</span>
      <br />
      <h2 aria-label="Carbon Credits">Carbon Credits:</h2>
      <span>{state.data?.carbonCredits || 'N/A'}</span>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';

interface ApiResponse {
  carbonFootprint: number;
  carbonCredits: number;
}

interface Props {
  apiKey: string;
  businessName: string;
}

interface State {
  loading: boolean;
  data: ApiResponse | null;
  error: string | null;
}

const MyComponent: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const validateApiKey = (apiKey: string) => {
    if (!apiKey || apiKey.length === 0) {
      throw new Error('API key is required');
    }
    return apiKey;
  };

  const fetchData = async () => {
    try {
      const apiKey = validateApiKey(props.apiKey);
      const response = await fetch(`https://api.carboncred.com/v1/business/${props.businessName}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as ApiResponse;
      setState({ loading: false, data, error: null });
    } catch (error) {
      setState({ loading: false, data: null, error: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.apiKey, props.businessName]);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return (
      <div>
        <div role="alert" aria-label="Error">
          {state.error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 aria-label="Carbon Footprint">Carbon Footprint:</h2>
      <span>{state.data?.carbonFootprint || 'N/A'}</span>
      <br />
      <h2 aria-label="Carbon Credits">Carbon Credits:</h2>
      <span>{state.data?.carbonCredits || 'N/A'}</span>
    </div>
  );
};

export default MyComponent;