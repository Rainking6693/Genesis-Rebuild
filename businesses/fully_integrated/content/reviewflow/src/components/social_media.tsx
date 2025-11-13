import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SocialMediaPostProps {
  platform: 'facebook' | 'twitter' | 'instagram';
  initialLikes?: number;
  postId: string;
  content: string;
  onLikeUpdate?: (postId: string, newLikes: number) => void; // Optional callback for like updates
  onError?: (message: string) => void; // Optional error handler
}

const SocialMediaPost: React.FC<SocialMediaPostProps> = ({
  platform,
  initialLikes = 0,
  postId,
  content,
  onLikeUpdate,
  onError,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useRef to prevent state updates on unmounted components
  const isMounted = useRef(true);

  // Constants for local storage key
  const LIKE_STATUS_KEY = `likeStatus-${postId}`;

  // Error handling function
  const handleError = useCallback(
    (message: string) => {
      console.error(message);
      setError(message);
      onError?.(message); // Call the parent's error handler if provided
    },
    [onError]
  );

  const handleLike = useCallback(() => {
    setIsLiked((prevIsLiked) => {
      const newLikeStatus = !prevIsLiked;
      setLikes((prevLikes) => {
        let newLikes = prevLikes + (newLikeStatus ? 1 : -1);

        // Prevent likes from going below 0
        newLikes = Math.max(0, newLikes);

        // Optimistic update: Update the UI immediately
        if (onLikeUpdate) {
          onLikeUpdate(postId, newLikes);
        }

        // Persist like status to local storage
        try {
          localStorage.setItem(LIKE_STATUS_KEY, newLikeStatus.toString());
        } catch (localStorageError: any) {
          console.error('Error saving like status to local storage:', localStorageError);
          handleError(
            `Failed to save like status to local storage: ${localStorageError.message}`
          );

          // Revert the optimistic update if local storage fails
          setLikes(prevLikes);
          setIsLiked(prevIsLiked);
          return prevLikes;
        }

        // Simulate sending like to server (replace with actual API call)
        console.log(
          `Simulating sending like to server for post ${postId} on ${platform}. New like count: ${newLikes}`
        );
        return newLikes;
      });
      return newLikeStatus;
    });
  }, [postId, platform, onLikeUpdate, handleError, LIKE_STATUS_KEY]);

  useEffect(() => {
    const loadLikeStatus = async () => {
      if (!isMounted.current) return;

      setLoading(true);
      try {
        const storedLikeStatus = localStorage.getItem(LIKE_STATUS_KEY);
        if (storedLikeStatus) {
          setIsLiked(storedLikeStatus === 'true');
        }
      } catch (localStorageError: any) {
        console.error('Error loading like status from local storage:', localStorageError);
        handleError(
          `Failed to load like status from local storage: ${localStorageError.message}`
        );
        setIsLiked(false); // Default to not liked
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadLikeStatus();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted.current = false;
    };
  }, [postId, handleError, LIKE_STATUS_KEY]);

  const platformColor = useCallback(() => {
    switch (platform) {
      case 'facebook':
        return 'blue';
      case 'twitter':
        return 'skyblue';
      case 'instagram':
        return 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)';
      default:
        return 'gray';
    }
  }, [platform]);

  const platformColorValue = platformColor();

  const buttonText = isLiked ? 'Unlike' : 'Like';

  // Accessibility improvements: aria-label, role, and focus styles
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
        backgroundColor: loading ? '#f0f0f0' : 'white',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {error && (
        <div style={{ color: 'red', marginBottom: '5px' }} role="alert">
          Error: {error}
        </div>
      )}
      <p>Platform: {platform}</p>
      <p>Post ID: {postId}</p>
      <p>Content: {content}</p>
      <p aria-label={`Likes: ${likes}`}>Likes: {likes}</p>
      <button
        onClick={handleLike}
        style={{
          backgroundColor: isLiked ? 'lightgreen' : 'white',
          color: 'black',
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          cursor: 'pointer',
          outline: 'none', // Remove default outline
        }}
        aria-label={buttonText}
        disabled={loading}
      >
        {loading ? 'Loading...' : buttonText}
      </button>
    </div>
  );
};

export default SocialMediaPost;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SocialMediaPostProps {
  platform: 'facebook' | 'twitter' | 'instagram';
  initialLikes?: number;
  postId: string;
  content: string;
  onLikeUpdate?: (postId: string, newLikes: number) => void; // Optional callback for like updates
  onError?: (message: string) => void; // Optional error handler
}

const SocialMediaPost: React.FC<SocialMediaPostProps> = ({
  platform,
  initialLikes = 0,
  postId,
  content,
  onLikeUpdate,
  onError,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useRef to prevent state updates on unmounted components
  const isMounted = useRef(true);

  // Constants for local storage key
  const LIKE_STATUS_KEY = `likeStatus-${postId}`;

  // Error handling function
  const handleError = useCallback(
    (message: string) => {
      console.error(message);
      setError(message);
      onError?.(message); // Call the parent's error handler if provided
    },
    [onError]
  );

  const handleLike = useCallback(() => {
    setIsLiked((prevIsLiked) => {
      const newLikeStatus = !prevIsLiked;
      setLikes((prevLikes) => {
        let newLikes = prevLikes + (newLikeStatus ? 1 : -1);

        // Prevent likes from going below 0
        newLikes = Math.max(0, newLikes);

        // Optimistic update: Update the UI immediately
        if (onLikeUpdate) {
          onLikeUpdate(postId, newLikes);
        }

        // Persist like status to local storage
        try {
          localStorage.setItem(LIKE_STATUS_KEY, newLikeStatus.toString());
        } catch (localStorageError: any) {
          console.error('Error saving like status to local storage:', localStorageError);
          handleError(
            `Failed to save like status to local storage: ${localStorageError.message}`
          );

          // Revert the optimistic update if local storage fails
          setLikes(prevLikes);
          setIsLiked(prevIsLiked);
          return prevLikes;
        }

        // Simulate sending like to server (replace with actual API call)
        console.log(
          `Simulating sending like to server for post ${postId} on ${platform}. New like count: ${newLikes}`
        );
        return newLikes;
      });
      return newLikeStatus;
    });
  }, [postId, platform, onLikeUpdate, handleError, LIKE_STATUS_KEY]);

  useEffect(() => {
    const loadLikeStatus = async () => {
      if (!isMounted.current) return;

      setLoading(true);
      try {
        const storedLikeStatus = localStorage.getItem(LIKE_STATUS_KEY);
        if (storedLikeStatus) {
          setIsLiked(storedLikeStatus === 'true');
        }
      } catch (localStorageError: any) {
        console.error('Error loading like status from local storage:', localStorageError);
        handleError(
          `Failed to load like status from local storage: ${localStorageError.message}`
        );
        setIsLiked(false); // Default to not liked
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadLikeStatus();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted.current = false;
    };
  }, [postId, handleError, LIKE_STATUS_KEY]);

  const platformColor = useCallback(() => {
    switch (platform) {
      case 'facebook':
        return 'blue';
      case 'twitter':
        return 'skyblue';
      case 'instagram':
        return 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)';
      default:
        return 'gray';
    }
  }, [platform]);

  const platformColorValue = platformColor();

  const buttonText = isLiked ? 'Unlike' : 'Like';

  // Accessibility improvements: aria-label, role, and focus styles
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
        backgroundColor: loading ? '#f0f0f0' : 'white',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {error && (
        <div style={{ color: 'red', marginBottom: '5px' }} role="alert">
          Error: {error}
        </div>
      )}
      <p>Platform: {platform}</p>
      <p>Post ID: {postId}</p>
      <p>Content: {content}</p>
      <p aria-label={`Likes: ${likes}`}>Likes: {likes}</p>
      <button
        onClick={handleLike}
        style={{
          backgroundColor: isLiked ? 'lightgreen' : 'white',
          color: 'black',
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          cursor: 'pointer',
          outline: 'none', // Remove default outline
        }}
        aria-label={buttonText}
        disabled={loading}
      >
        {loading ? 'Loading...' : buttonText}
      </button>
    </div>
  );
};

export default SocialMediaPost;