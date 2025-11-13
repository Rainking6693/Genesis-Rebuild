import axios from 'axios';

interface Content {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

const fetchContent = async (apiUrl: string): Promise<Content[] | Error> => {
  try {
    const response = await axios.get(apiUrl);
    const data = response.data as Content[];

    // Check for edge cases
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    // Ensure accessibility by adding alt text to images
    data.forEach((content) => {
      if (content.imageUrl) {
        content.imageAltText = 'Image for content with title: ' + content.title;
      }
    });

    return data;
  } catch (error) {
    return new Error('Failed to fetch content');
  }
};

// Usage example
fetchContent('https://example-api.com/content')
  .then((content) => {
    // Handle the fetched content
  })
  .catch((error) => {
    // Handle the error
  });

import axios from 'axios';

interface Content {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

const fetchContent = async (apiUrl: string): Promise<Content[] | Error> => {
  try {
    const response = await axios.get(apiUrl);
    const data = response.data as Content[];

    // Check for edge cases
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    // Ensure accessibility by adding alt text to images
    data.forEach((content) => {
      if (content.imageUrl) {
        content.imageAltText = 'Image for content with title: ' + content.title;
      }
    });

    return data;
  } catch (error) {
    return new Error('Failed to fetch content');
  }
};

// Usage example
fetchContent('https://example-api.com/content')
  .then((content) => {
    // Handle the fetched content
  })
  .catch((error) => {
    // Handle the error
  });