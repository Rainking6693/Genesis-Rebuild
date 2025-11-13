import axios, { AxiosError } from 'axios'; // Ensure to import a secure HTTPS client
import { isNumber } from 'class-validator'; // For input validation

const API_URL = 'https://api.reviewflow.ai/v1'; // Replace with the actual API URL
const MAX_ATTEMPTS = 3; // Maximum number of retries for a failed request
const SLEEP_DURATION = 1000; // Milliseconds to wait between retries

async function sendReviewResponse(reviewId: number): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_ATTEMPTS) {
    attempt++;

    try {
      const response = await axios.post(`${API_URL}/review/${reviewId}/response`, {
        // Add any necessary data here
      });

      if (response.status === 200) {
        console.log(`Review response sent successfully. Attempt ${attempt}`);
        break;
      }
    } catch (error) {
      if (attempt < MAX_ATTEMPTS) {
        console.error(`Error sending review response (attempt ${attempt}):`, error);
        await new Promise((resolve) => setTimeout(resolve, SLEEP_DURATION));
      } else {
        throw new Error(`Failed to send review response after ${MAX_ATTEMPTS} attempts: ${error.message}`);
      }
    }
  }
}

// Validate the input to ensure it's a number
if (!isNumber(reviewId)) {
  throw new Error('Invalid review ID');
}

sendReviewResponse(123)
  .then(() => {
    // Handle successful response
  })
  .catch((error) => {
    // Handle error
    if (error instanceof AxiosError) {
      console.error('Axios error:', error.response?.status, error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error.message);
    }
  });

import axios, { AxiosError } from 'axios'; // Ensure to import a secure HTTPS client
import { isNumber } from 'class-validator'; // For input validation

const API_URL = 'https://api.reviewflow.ai/v1'; // Replace with the actual API URL
const MAX_ATTEMPTS = 3; // Maximum number of retries for a failed request
const SLEEP_DURATION = 1000; // Milliseconds to wait between retries

async function sendReviewResponse(reviewId: number): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_ATTEMPTS) {
    attempt++;

    try {
      const response = await axios.post(`${API_URL}/review/${reviewId}/response`, {
        // Add any necessary data here
      });

      if (response.status === 200) {
        console.log(`Review response sent successfully. Attempt ${attempt}`);
        break;
      }
    } catch (error) {
      if (attempt < MAX_ATTEMPTS) {
        console.error(`Error sending review response (attempt ${attempt}):`, error);
        await new Promise((resolve) => setTimeout(resolve, SLEEP_DURATION));
      } else {
        throw new Error(`Failed to send review response after ${MAX_ATTEMPTS} attempts: ${error.message}`);
      }
    }
  }
}

// Validate the input to ensure it's a number
if (!isNumber(reviewId)) {
  throw new Error('Invalid review ID');
}

sendReviewResponse(123)
  .then(() => {
    // Handle successful response
  })
  .catch((error) => {
    // Handle error
    if (error instanceof AxiosError) {
      console.error('Axios error:', error.response?.status, error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error.message);
    }
  });