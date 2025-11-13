import axios from 'axios';

interface SocialMediaPost {
  platform: string;
  message: string;
  mediaUrl?: string;
}

async function postMessage(post: SocialMediaPost): Promise<void> {
  try {
    const { platform, message, mediaUrl } = post;

    // Define the API endpoint for each platform
    const apiEndpoints = {
      twitter: 'https://api.twitter.com/1.1/statuses/update.json',
      facebook: 'https://graph.facebook.com/v12.0/me/feed',
      instagram: 'https://graph.instagram.com/v12.0/me/media', // Note: Instagram doesn't support text-only posts via API
    };

    // Check if the platform is supported
    if (!apiEndpoints[platform]) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Prepare the request data
    let data: any = {
      message,
    };

    if (mediaUrl) {
      data = {
        ...data,
        media: [{ url: mediaUrl }],
      };
    }

    // Make the API request
    const response = await axios.post(apiEndpoints[platform], data, {
      headers: {
        Authorization: `Bearer YOUR_API_KEY`, // Replace with your API key
      },
    });

    // Check if the post was successful
    if (response.status !== 200) {
      throw new Error(`Failed to post message on ${platform}: ${response.statusText}`);
    }

    console.log(`Successfully posted message on ${platform}`);
  } catch (error) {
    console.error(`Error posting message on ${post.platform}: ${error.message}`);
  }
}

// Usage example
postMessage({
  platform: 'twitter',
  message: 'Check out our new content!',
});

import axios from 'axios';

interface SocialMediaPost {
  platform: string;
  message: string;
  mediaUrl?: string;
}

async function postMessage(post: SocialMediaPost): Promise<void> {
  try {
    const { platform, message, mediaUrl } = post;

    // Define the API endpoint for each platform
    const apiEndpoints = {
      twitter: 'https://api.twitter.com/1.1/statuses/update.json',
      facebook: 'https://graph.facebook.com/v12.0/me/feed',
      instagram: 'https://graph.instagram.com/v12.0/me/media', // Note: Instagram doesn't support text-only posts via API
    };

    // Check if the platform is supported
    if (!apiEndpoints[platform]) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Prepare the request data
    let data: any = {
      message,
    };

    if (mediaUrl) {
      data = {
        ...data,
        media: [{ url: mediaUrl }],
      };
    }

    // Make the API request
    const response = await axios.post(apiEndpoints[platform], data, {
      headers: {
        Authorization: `Bearer YOUR_API_KEY`, // Replace with your API key
      },
    });

    // Check if the post was successful
    if (response.status !== 200) {
      throw new Error(`Failed to post message on ${platform}: ${response.statusText}`);
    }

    console.log(`Successfully posted message on ${platform}`);
  } catch (error) {
    console.error(`Error posting message on ${post.platform}: ${error.message}`);
  }
}

// Usage example
postMessage({
  platform: 'twitter',
  message: 'Check out our new content!',
});