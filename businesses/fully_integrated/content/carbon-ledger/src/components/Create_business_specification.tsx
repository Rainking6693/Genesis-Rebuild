import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SustainabilityMetrics {
  carbonFootprint: number;
  renewableEnergy: number;
  wasteReduction: number;
}

interface ImpactStory {
  title: string;
  content: string;
  id: string; // Added an ID for better key management and potential updates
}

interface CarbonLedgerProps {
  businessName: string;
  description: string;
  sustainability: SustainabilityMetrics;
  impactStories: ImpactStory[];
  apiEndpoint?: string; // Optional prop for API endpoint, defaults to a standard value
}

interface ApiResponse {
  businessName: string;
  description: string;
  sustainability: SustainabilityMetrics;
  impactStories: ImpactStory[];
}

const CarbonLedger: React.FC<CarbonLedgerProps> = ({
  businessName: initialBusinessName,
  description: initialDescription,
  sustainability: initialSustainability,
  impactStories: initialImpactStories,
  apiEndpoint = `/api/businesses`, // Default API endpoint
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CarbonLedgerProps | null>(null);
  const [businessName, setBusinessName] = useState<string>(initialBusinessName); // Local state for business name, allowing updates

  // Input validation for props
  useEffect(() => {
    if (!initialBusinessName || typeof initialBusinessName !== 'string') {
      console.error("Invalid businessName prop.  Must be a non-empty string.");
      setError("Invalid businessName provided.");
      setLoading(false);
      return;
    }

    if (typeof initialDescription !== 'string') {
      console.warn("Description prop should be a string."); // Non-critical, just a warning
    }

    if (
      typeof initialSustainability !== 'object' ||
      initialSustainability === null ||
      typeof initialSustainability.carbonFootprint !== 'number' ||
      typeof initialSustainability.renewableEnergy !== 'number' ||
      typeof initialSustainability.wasteReduction !== 'number'
    ) {
      console.error("Invalid sustainability prop.  Must be an object with numeric values.");
      setError("Invalid sustainability data provided.");
      setLoading(false);
      return;
    }

    if (!Array.isArray(initialImpactStories)) {
      console.error("impactStories prop must be an array.");
      setError("Invalid impact stories provided.");
      setLoading(false);
      return;
    }

    initialImpactStories.forEach((story, index) => {
      if (typeof story !== 'object' || story === null || typeof story.title !== 'string' || typeof story.content !== 'string' || typeof story.id !== 'string') {
        console.error(`Invalid impact story at index ${index}.  Each story must have a title, content, and id (all strings).`);
        setError("Invalid impact stories provided.");
        setLoading(false);
        return;
      }
    });
  }, [initialBusinessName, initialDescription, initialSustainability, initialImpactStories]);

  const fetchData = useCallback(async () => {
    setLoading(true); // Ensure loading is true at the start of each fetch
    setError(null); // Clear any previous errors

    try {
      const url = `${apiEndpoint}/${businessName}`;
      const response: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(url);

      // Validate the response data structure
      if (
        typeof response.data !== 'object' ||
        response.data === null ||
        typeof response.data.businessName !== 'string' ||
        typeof response.data.description !== 'string' ||
        typeof response.data.sustainability !== 'object' ||
        response.data.sustainability === null ||
        !Array.isArray(response.data.impactStories)
      ) {
        console.error("Invalid data structure received from API.");
        setError("Invalid data received from the server.");
        setLoading(false);
        return;
      }

      // Map the API response to the CarbonLedgerProps interface
      const mappedData: CarbonLedgerProps = {
        businessName: response.data.businessName,
        description: response.data.description,
        sustainability: response.data.sustainability,
        impactStories: response.data.impactStories,
        apiEndpoint: apiEndpoint // Pass the apiEndpoint to the data
      };

      setData(mappedData);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching data:", axiosError);

      let errorMessage = 'Error fetching data. Please try again later.';
      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || errorMessage;
        if (axiosError.response.status === 404) {
          errorMessage = `Business "${businessName}" not found.`; // Specific message for 404
        }
      } else if (axiosError.request) {
        errorMessage = 'Network error. Please check your internet connection.'; // Specific message for network errors
      }

      setError(errorMessage);
      setLoading(false);
    }
  }, [businessName, apiEndpoint]);

  useEffect(() => {
    if (!error) { // Only fetch if there's no initial validation error
      fetchData();
    }
  }, [fetchData, error]);

  // Function to handle business name changes (example of maintainability)
  const handleBusinessNameChange = (newName: string) => {
    setBusinessName(newName);
  };

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <p>Loading...</p>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        {/* Provide a way to retry if there's an error */}
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div role="alert">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <label htmlFor="businessName">Business Name:</label>
      <input
        type="text"
        id="businessName"
        value={businessName}
        onChange={(e) => handleBusinessNameChange(e.target.value)}
      />
      <h1>{data.businessName}</h1>
      <p>{data.description}</p>
      <h2>Sustainability Efforts</h2>
      <p>Carbon Footprint: {data.sustainability.carbonFootprint} tons</p>
      <p>Renewable Energy: {data.sustainability.renewableEnergy}%</p>
      <p>Waste Reduction: {data.sustainability.wasteReduction}%</p>
      <h2>Impact Stories</h2>
      {data.impactStories.length === 0 ? (
        <p>No impact stories available.</p>
      ) : (
        data.impactStories.map((story) => (
          <div key={story.id}>
            <h3>{story.title}</h3>
            <p>{story.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CarbonLedger;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SustainabilityMetrics {
  carbonFootprint: number;
  renewableEnergy: number;
  wasteReduction: number;
}

interface ImpactStory {
  title: string;
  content: string;
  id: string; // Added an ID for better key management and potential updates
}

interface CarbonLedgerProps {
  businessName: string;
  description: string;
  sustainability: SustainabilityMetrics;
  impactStories: ImpactStory[];
  apiEndpoint?: string; // Optional prop for API endpoint, defaults to a standard value
}

interface ApiResponse {
  businessName: string;
  description: string;
  sustainability: SustainabilityMetrics;
  impactStories: ImpactStory[];
}

const CarbonLedger: React.FC<CarbonLedgerProps> = ({
  businessName: initialBusinessName,
  description: initialDescription,
  sustainability: initialSustainability,
  impactStories: initialImpactStories,
  apiEndpoint = `/api/businesses`, // Default API endpoint
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CarbonLedgerProps | null>(null);
  const [businessName, setBusinessName] = useState<string>(initialBusinessName); // Local state for business name, allowing updates

  // Input validation for props
  useEffect(() => {
    if (!initialBusinessName || typeof initialBusinessName !== 'string') {
      console.error("Invalid businessName prop.  Must be a non-empty string.");
      setError("Invalid businessName provided.");
      setLoading(false);
      return;
    }

    if (typeof initialDescription !== 'string') {
      console.warn("Description prop should be a string."); // Non-critical, just a warning
    }

    if (
      typeof initialSustainability !== 'object' ||
      initialSustainability === null ||
      typeof initialSustainability.carbonFootprint !== 'number' ||
      typeof initialSustainability.renewableEnergy !== 'number' ||
      typeof initialSustainability.wasteReduction !== 'number'
    ) {
      console.error("Invalid sustainability prop.  Must be an object with numeric values.");
      setError("Invalid sustainability data provided.");
      setLoading(false);
      return;
    }

    if (!Array.isArray(initialImpactStories)) {
      console.error("impactStories prop must be an array.");
      setError("Invalid impact stories provided.");
      setLoading(false);
      return;
    }

    initialImpactStories.forEach((story, index) => {
      if (typeof story !== 'object' || story === null || typeof story.title !== 'string' || typeof story.content !== 'string' || typeof story.id !== 'string') {
        console.error(`Invalid impact story at index ${index}.  Each story must have a title, content, and id (all strings).`);
        setError("Invalid impact stories provided.");
        setLoading(false);
        return;
      }
    });
  }, [initialBusinessName, initialDescription, initialSustainability, initialImpactStories]);

  const fetchData = useCallback(async () => {
    setLoading(true); // Ensure loading is true at the start of each fetch
    setError(null); // Clear any previous errors

    try {
      const url = `${apiEndpoint}/${businessName}`;
      const response: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(url);

      // Validate the response data structure
      if (
        typeof response.data !== 'object' ||
        response.data === null ||
        typeof response.data.businessName !== 'string' ||
        typeof response.data.description !== 'string' ||
        typeof response.data.sustainability !== 'object' ||
        response.data.sustainability === null ||
        !Array.isArray(response.data.impactStories)
      ) {
        console.error("Invalid data structure received from API.");
        setError("Invalid data received from the server.");
        setLoading(false);
        return;
      }

      // Map the API response to the CarbonLedgerProps interface
      const mappedData: CarbonLedgerProps = {
        businessName: response.data.businessName,
        description: response.data.description,
        sustainability: response.data.sustainability,
        impactStories: response.data.impactStories,
        apiEndpoint: apiEndpoint // Pass the apiEndpoint to the data
      };

      setData(mappedData);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching data:", axiosError);

      let errorMessage = 'Error fetching data. Please try again later.';
      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || errorMessage;
        if (axiosError.response.status === 404) {
          errorMessage = `Business "${businessName}" not found.`; // Specific message for 404
        }
      } else if (axiosError.request) {
        errorMessage = 'Network error. Please check your internet connection.'; // Specific message for network errors
      }

      setError(errorMessage);
      setLoading(false);
    }
  }, [businessName, apiEndpoint]);

  useEffect(() => {
    if (!error) { // Only fetch if there's no initial validation error
      fetchData();
    }
  }, [fetchData, error]);

  // Function to handle business name changes (example of maintainability)
  const handleBusinessNameChange = (newName: string) => {
    setBusinessName(newName);
  };

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <p>Loading...</p>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        {/* Provide a way to retry if there's an error */}
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div role="alert">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <label htmlFor="businessName">Business Name:</label>
      <input
        type="text"
        id="businessName"
        value={businessName}
        onChange={(e) => handleBusinessNameChange(e.target.value)}
      />
      <h1>{data.businessName}</h1>
      <p>{data.description}</p>
      <h2>Sustainability Efforts</h2>
      <p>Carbon Footprint: {data.sustainability.carbonFootprint} tons</p>
      <p>Renewable Energy: {data.sustainability.renewableEnergy}%</p>
      <p>Waste Reduction: {data.sustainability.wasteReduction}%</p>
      <h2>Impact Stories</h2>
      {data.impactStories.length === 0 ? (
        <p>No impact stories available.</p>
      ) : (
        data.impactStories.map((story) => (
          <div key={story.id}>
            <h3>{story.title}</h3>
            <p>{story.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CarbonLedger;