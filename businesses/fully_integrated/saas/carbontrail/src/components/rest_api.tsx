import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CarbonOffsetData {
  item_id: string;
  quantity: number;
  carbon_footprint_kg: number;
  offset_cost_usd: number;
}

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  itemId: string;
  apiEndpoint: string;
  onPurchase?: (data: CarbonOffsetData) => void;
  debounceDelay?: number; // Add debounce delay as a prop
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  itemId,
  apiEndpoint,
  onPurchase,
  debounceDelay = 300, // Default debounce delay
}) => {
  const [count, setCount] = useState(initialCount);
  const [carbonData, setCarbonData] = useState<CarbonOffsetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true); // Track component mount status

  // Prop validation with more robust checks
  useEffect(() => {
    if (!itemId || typeof itemId !== 'string' || itemId.trim() === '') {
      console.error("Counter component requires a valid itemId prop (non-empty string).");
    }

    if (!apiEndpoint || typeof apiEndpoint !== 'string' || apiEndpoint.trim() === '') {
      console.error("Counter component requires a valid apiEndpoint prop (non-empty string).");
    }

    if (typeof initialCount !== 'number' || !Number.isInteger(initialCount) || initialCount < 0) {
      console.warn("initialCount should be a non-negative integer. Defaulting to 0.");
    }

    if (typeof incrementStep !== 'number' || !Number.isInteger(incrementStep) || incrementStep <= 0) {
      console.warn("incrementStep should be a positive integer. Defaulting to 1.");
    }

    if (typeof debounceDelay !== 'number' || !Number.isInteger(debounceDelay) || debounceDelay < 0) {
      console.warn("debounceDelay should be a non-negative integer. Defaulting to 300ms.");
    }
  }, [itemId, apiEndpoint, initialCount, incrementStep, debounceDelay]);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + incrementStep);
  }, [incrementStep]);

  const decrement = useCallback(() => {
    setCount((prevCount) => Math.max(0, prevCount - incrementStep));
  }, [incrementStep]);

  const fetchCarbonData = useCallback(
    async (quantity: number) => {
      if (!itemId || !apiEndpoint) {
        console.error("itemId or apiEndpoint is missing. Cannot fetch data.");
        return; // Exit early if required props are missing
      }

      setLoading(true);
      setError(null);
      try {
        const url = `${apiEndpoint}?item_id=${itemId}&quantity=${quantity}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary headers (e.g., authorization)
          },
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! Status: ${response.status}`;
          let errorDetails: any = null;

          try {
            errorDetails = await response.json(); // Attempt to parse JSON error response
            errorMessage = errorDetails.message || errorMessage; // Use API error message if available
          } catch (jsonError) {
            console.warn("Failed to parse error JSON:", jsonError);
            errorMessage = `HTTP error! Status: ${response.status}.  Failed to parse error details.`;
          }

          // Log the error details for debugging
          console.error("API Error:", {
            status: response.status,
            url,
            details: errorDetails,
          });

          // Specific error handling based on status code
          if (response.status === 400) {
            errorMessage = "Invalid request. Please check the quantity.";
          } else if (response.status === 404) {
            errorMessage = "Item not found. Please check the item ID.";
          } else if (response.status === 500) {
            errorMessage = "Internal server error. Please try again later.";
          }

          throw new Error(errorMessage);
        }

        const data: CarbonOffsetData = await response.json();

        if (isMounted.current) {
          setCarbonData(data);
        }

      } catch (error: any) {
        console.error("Fetch error:", error);
        if (isMounted.current) {
          setError(error.message || "An unexpected error occurred."); // Provide a fallback error message
          setCarbonData(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [apiEndpoint, itemId]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCarbonData(count);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [count, fetchCarbonData, debounceDelay]);

  const handlePurchase = useCallback(() => {
    if (carbonData && onPurchase) {
      onPurchase(carbonData);
    } else {
      console.warn("No carbon data available or onPurchase callback not provided.");
      setError("Unable to purchase carbon offset. Please try again.");
    }
  }, [carbonData, onPurchase]);

  // Cleanup function to prevent state updates on unmounted component
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div aria-live="polite">
      <p>Quantity: {count}</p>
      <button onClick={increment} aria-label="Increment quantity">
        Increment
      </button>
      <button onClick={decrement} aria-label="Decrement quantity">
        Decrement
      </button>

      {loading && <p>Loading carbon offset data...</p>}
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          Error: {error}
        </p>
      )}

      {carbonData && (
        <div>
          <p>Carbon Footprint: {carbonData.carbon_footprint_kg} kg</p>
          <p>Offset Cost: ${carbonData.offset_cost_usd}</p>
          <button
            onClick={handlePurchase}
            disabled={loading || !onPurchase} // Disable if loading or onPurchase is not provided
            aria-label="Purchase carbon offset"
            style={{ cursor: loading || !onPurchase ? 'not-allowed' : 'pointer' }} // Indicate disabled state visually
          >
            {loading ? "Processing..." : "Purchase Carbon Offset"}
          </button>
          {!onPurchase && <p style={{color: 'orange'}}>Purchase functionality is not available.</p>}
        </div>
      )}
    </div>
  );
};

export default Counter;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CarbonOffsetData {
  item_id: string;
  quantity: number;
  carbon_footprint_kg: number;
  offset_cost_usd: number;
}

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  itemId: string;
  apiEndpoint: string;
  onPurchase?: (data: CarbonOffsetData) => void;
  debounceDelay?: number; // Add debounce delay as a prop
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  itemId,
  apiEndpoint,
  onPurchase,
  debounceDelay = 300, // Default debounce delay
}) => {
  const [count, setCount] = useState(initialCount);
  const [carbonData, setCarbonData] = useState<CarbonOffsetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true); // Track component mount status

  // Prop validation with more robust checks
  useEffect(() => {
    if (!itemId || typeof itemId !== 'string' || itemId.trim() === '') {
      console.error("Counter component requires a valid itemId prop (non-empty string).");
    }

    if (!apiEndpoint || typeof apiEndpoint !== 'string' || apiEndpoint.trim() === '') {
      console.error("Counter component requires a valid apiEndpoint prop (non-empty string).");
    }

    if (typeof initialCount !== 'number' || !Number.isInteger(initialCount) || initialCount < 0) {
      console.warn("initialCount should be a non-negative integer. Defaulting to 0.");
    }

    if (typeof incrementStep !== 'number' || !Number.isInteger(incrementStep) || incrementStep <= 0) {
      console.warn("incrementStep should be a positive integer. Defaulting to 1.");
    }

    if (typeof debounceDelay !== 'number' || !Number.isInteger(debounceDelay) || debounceDelay < 0) {
      console.warn("debounceDelay should be a non-negative integer. Defaulting to 300ms.");
    }
  }, [itemId, apiEndpoint, initialCount, incrementStep, debounceDelay]);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + incrementStep);
  }, [incrementStep]);

  const decrement = useCallback(() => {
    setCount((prevCount) => Math.max(0, prevCount - incrementStep));
  }, [incrementStep]);

  const fetchCarbonData = useCallback(
    async (quantity: number) => {
      if (!itemId || !apiEndpoint) {
        console.error("itemId or apiEndpoint is missing. Cannot fetch data.");
        return; // Exit early if required props are missing
      }

      setLoading(true);
      setError(null);
      try {
        const url = `${apiEndpoint}?item_id=${itemId}&quantity=${quantity}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary headers (e.g., authorization)
          },
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! Status: ${response.status}`;
          let errorDetails: any = null;

          try {
            errorDetails = await response.json(); // Attempt to parse JSON error response
            errorMessage = errorDetails.message || errorMessage; // Use API error message if available
          } catch (jsonError) {
            console.warn("Failed to parse error JSON:", jsonError);
            errorMessage = `HTTP error! Status: ${response.status}.  Failed to parse error details.`;
          }

          // Log the error details for debugging
          console.error("API Error:", {
            status: response.status,
            url,
            details: errorDetails,
          });

          // Specific error handling based on status code
          if (response.status === 400) {
            errorMessage = "Invalid request. Please check the quantity.";
          } else if (response.status === 404) {
            errorMessage = "Item not found. Please check the item ID.";
          } else if (response.status === 500) {
            errorMessage = "Internal server error. Please try again later.";
          }

          throw new Error(errorMessage);
        }

        const data: CarbonOffsetData = await response.json();

        if (isMounted.current) {
          setCarbonData(data);
        }

      } catch (error: any) {
        console.error("Fetch error:", error);
        if (isMounted.current) {
          setError(error.message || "An unexpected error occurred."); // Provide a fallback error message
          setCarbonData(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [apiEndpoint, itemId]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCarbonData(count);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [count, fetchCarbonData, debounceDelay]);

  const handlePurchase = useCallback(() => {
    if (carbonData && onPurchase) {
      onPurchase(carbonData);
    } else {
      console.warn("No carbon data available or onPurchase callback not provided.");
      setError("Unable to purchase carbon offset. Please try again.");
    }
  }, [carbonData, onPurchase]);

  // Cleanup function to prevent state updates on unmounted component
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div aria-live="polite">
      <p>Quantity: {count}</p>
      <button onClick={increment} aria-label="Increment quantity">
        Increment
      </button>
      <button onClick={decrement} aria-label="Decrement quantity">
        Decrement
      </button>

      {loading && <p>Loading carbon offset data...</p>}
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          Error: {error}
        </p>
      )}

      {carbonData && (
        <div>
          <p>Carbon Footprint: {carbonData.carbon_footprint_kg} kg</p>
          <p>Offset Cost: ${carbonData.offset_cost_usd}</p>
          <button
            onClick={handlePurchase}
            disabled={loading || !onPurchase} // Disable if loading or onPurchase is not provided
            aria-label="Purchase carbon offset"
            style={{ cursor: loading || !onPurchase ? 'not-allowed' : 'pointer' }} // Indicate disabled state visually
          >
            {loading ? "Processing..." : "Purchase Carbon Offset"}
          </button>
          {!onPurchase && <p style={{color: 'orange'}}>Purchase functionality is not available.</p>}
        </div>
      )}
    </div>
  );
};

export default Counter;