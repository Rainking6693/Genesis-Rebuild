import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Review {
  product: string;
  rating: number;
  content: string;
  reviewer: string;
  date: string;
}

interface ReviewReportProps {
  startDate: string;
  endDate: string;
}

const ReviewReport: React.FC<ReviewReportProps> = ({ startDate, endDate }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const response: AxiosResponse<Review[]> = await axios.get<Review[]>(
        `/api/reviews?startDate=${startDate}&endDate=${endDate}`
      );
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || axiosError.message || 'Error fetching reviews'
      );
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      try {
        await fetchReviews();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [fetchReviews]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchReviews();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Review Report</h1>
      <table aria-label="Review Report" className="review-report-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Reviewer</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index}>
              <td>{review.product}</td>
              <td>{review.rating}</td>
              <td>{review.content}</td>
              <td>{review.reviewer}</td>
              <td>{review.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewReport;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Review {
  product: string;
  rating: number;
  content: string;
  reviewer: string;
  date: string;
}

interface ReviewReportProps {
  startDate: string;
  endDate: string;
}

const ReviewReport: React.FC<ReviewReportProps> = ({ startDate, endDate }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const response: AxiosResponse<Review[]> = await axios.get<Review[]>(
        `/api/reviews?startDate=${startDate}&endDate=${endDate}`
      );
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || axiosError.message || 'Error fetching reviews'
      );
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      try {
        await fetchReviews();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [fetchReviews]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchReviews();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Review Report</h1>
      <table aria-label="Review Report" className="review-report-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Reviewer</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index}>
              <td>{review.product}</td>
              <td>{review.rating}</td>
              <td>{review.content}</td>
              <td>{review.reviewer}</td>
              <td>{review.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewReport;