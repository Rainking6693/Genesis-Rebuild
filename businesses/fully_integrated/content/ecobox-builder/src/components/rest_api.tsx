import React, { PropsWithChildren, ReactNode } from 'react';

interface MessageProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const Message: React.FC<MessageProps> = ({ children, className, ariaLabel }) => {
  return (
    <div className={className} aria-label={ariaLabel}>
      {children}
    </div>
  );
};

export default Message;

// Usage:
// <Message>Your custom message</Message>
// <Message className="custom-class" aria-label="Your custom aria label">Your custom message</Message>

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'https://your-api-url.com';
const API_TIMEOUT = 10000;
const API_HEADERS = {
  'Content-Type': 'application/json',
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: API_HEADERS,
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add your request interceptor logic here
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors
    console.error(error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add your response interceptor logic here
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors
    console.error(error);
    return Promise.reject(error);
  }
);

export default api;

import React, { PropsWithChildren, ReactNode } from 'react';

interface MessageProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const Message: React.FC<MessageProps> = ({ children, className, ariaLabel }) => {
  return (
    <div className={className} aria-label={ariaLabel}>
      {children}
    </div>
  );
};

export default Message;

// Usage:
// <Message>Your custom message</Message>
// <Message className="custom-class" aria-label="Your custom aria label">Your custom message</Message>

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'https://your-api-url.com';
const API_TIMEOUT = 10000;
const API_HEADERS = {
  'Content-Type': 'application/json',
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: API_HEADERS,
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add your request interceptor logic here
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors
    console.error(error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add your response interceptor logic here
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors
    console.error(error);
    return Promise.reject(error);
  }
);

export default api;