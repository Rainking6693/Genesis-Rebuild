import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SocialMediaShareProps {
  meetingTitle: string;
  meetingSummary: string;
  hashtags?: string[];
  shareUrl?: string; // Optional: Allow specifying the URL to share
  fallbackCopyToClipboard?: boolean; // Optional: Enable copy to clipboard fallback
  buttonText?: string; // Optional: Customize the button text
  sharingText?: string; // Optional: Customize the "Sharing..." text
  onShareSuccess?: () => void; // Optional: Callback for successful share
  onShareError?: (error: string) => void; // Optional: Callback for share error
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({
  meetingTitle,
  meetingSummary,
  hashtags = [],
  shareUrl = typeof window !== 'undefined' ? window.location.href : '', // Default to current URL, handle SSR
  fallbackCopyToClipboard = true,
  buttonText = 'Share Meeting Insights',
  sharingText = 'Sharing...',
  onShareSuccess,
  onShareError,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const shareTextRef = useRef<string | null>(null); // Ref to store the share text
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);

  useEffect(() => {
    setIsWebShareSupported(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const generateShareText = useCallback(() => {
    const baseText = `Check out the key insights from our MeetingMind-powered meeting: "${meetingTitle}".\n\n${meetingSummary}\n\n`;
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ').trim();
    const fullText = baseText + (hashtagString ? hashtagString : '');
    shareTextRef.current = fullText; // Store the generated text
    return fullText;
  }, [meetingTitle, meetingSummary, hashtags]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or environments where navigator.clipboard is not available
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  //avoid scrolling to bottom of page in MS Edge.
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (!successful) {
            console.error('Fallback: Could not copy text');
            return false;
          }
          return true;
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          return false;
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err: any) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  }, []);

  const handleShare = async () => {
    setIsSharing(true);
    setShareError(null);

    const shareData = {
      title: meetingTitle,
      text: generateShareText(),
      url: shareUrl,
    };

    try {
      if (isWebShareSupported) {
        await navigator.share(shareData);
        console.log("Shared successfully");
        onShareSuccess?.(); // Call success callback if provided
      } else {
        console.warn("Web Share API not supported.");
        if (fallbackCopyToClipboard) {
          const textToCopy = shareTextRef.current;
          if (textToCopy) {
            const copied = await copyToClipboard(textToCopy);
            if (copied) {
              setShareError("Web Share API not supported. Text copied to clipboard. Please paste into your desired platform.");
            } else {
              setShareError("Web Share API not supported and failed to copy to clipboard. Please manually copy the meeting summary.");
              onShareError?.("Web Share API not supported and failed to copy to clipboard.");
            }
          } else {
            setShareError("Web Share API not supported and could not generate share text.");
            onShareError?.("Web Share API not supported and could not generate share text.");
          }
        } else {
          setShareError("Web Share API not supported. Please manually copy the meeting summary.");
          onShareError?.("Web Share API not supported.");
        }
      }
    } catch (error: any) {
      console.error("Error sharing:", error);
      let errorMessage = "Failed to share. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setShareError(errorMessage);
      onShareError?.(errorMessage); // Call error callback if provided
    } finally {
      setIsSharing(false);
    }
  };

  const errorMessageId = "share-error-message";

  return (
    <div>
      <button
        onClick={handleShare}
        disabled={isSharing}
        aria-label="Share meeting insights on social media"
        aria-busy={isSharing}
        aria-describedby={shareError ? errorMessageId : undefined}
      >
        {isSharing ? sharingText : buttonText}
      </button>
      {shareError && (
        <div
          id={errorMessageId}
          style={{ color: 'red', marginTop: '0.5em', padding: '0.5em', border: '1px solid red', borderRadius: '4px' }}
          role="alert"
        >
          {shareError}
        </div>
      )}
    </div>
  );
};

export default SocialMediaShare;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SocialMediaShareProps {
  meetingTitle: string;
  meetingSummary: string;
  hashtags?: string[];
  shareUrl?: string; // Optional: Allow specifying the URL to share
  fallbackCopyToClipboard?: boolean; // Optional: Enable copy to clipboard fallback
  buttonText?: string; // Optional: Customize the button text
  sharingText?: string; // Optional: Customize the "Sharing..." text
  onShareSuccess?: () => void; // Optional: Callback for successful share
  onShareError?: (error: string) => void; // Optional: Callback for share error
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({
  meetingTitle,
  meetingSummary,
  hashtags = [],
  shareUrl = typeof window !== 'undefined' ? window.location.href : '', // Default to current URL, handle SSR
  fallbackCopyToClipboard = true,
  buttonText = 'Share Meeting Insights',
  sharingText = 'Sharing...',
  onShareSuccess,
  onShareError,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const shareTextRef = useRef<string | null>(null); // Ref to store the share text
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);

  useEffect(() => {
    setIsWebShareSupported(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const generateShareText = useCallback(() => {
    const baseText = `Check out the key insights from our MeetingMind-powered meeting: "${meetingTitle}".\n\n${meetingSummary}\n\n`;
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ').trim();
    const fullText = baseText + (hashtagString ? hashtagString : '');
    shareTextRef.current = fullText; // Store the generated text
    return fullText;
  }, [meetingTitle, meetingSummary, hashtags]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or environments where navigator.clipboard is not available
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  //avoid scrolling to bottom of page in MS Edge.
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (!successful) {
            console.error('Fallback: Could not copy text');
            return false;
          }
          return true;
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          return false;
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err: any) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  }, []);

  const handleShare = async () => {
    setIsSharing(true);
    setShareError(null);

    const shareData = {
      title: meetingTitle,
      text: generateShareText(),
      url: shareUrl,
    };

    try {
      if (isWebShareSupported) {
        await navigator.share(shareData);
        console.log("Shared successfully");
        onShareSuccess?.(); // Call success callback if provided
      } else {
        console.warn("Web Share API not supported.");
        if (fallbackCopyToClipboard) {
          const textToCopy = shareTextRef.current;
          if (textToCopy) {
            const copied = await copyToClipboard(textToCopy);
            if (copied) {
              setShareError("Web Share API not supported. Text copied to clipboard. Please paste into your desired platform.");
            } else {
              setShareError("Web Share API not supported and failed to copy to clipboard. Please manually copy the meeting summary.");
              onShareError?.("Web Share API not supported and failed to copy to clipboard.");
            }
          } else {
            setShareError("Web Share API not supported and could not generate share text.");
            onShareError?.("Web Share API not supported and could not generate share text.");
          }
        } else {
          setShareError("Web Share API not supported. Please manually copy the meeting summary.");
          onShareError?.("Web Share API not supported.");
        }
      }
    } catch (error: any) {
      console.error("Error sharing:", error);
      let errorMessage = "Failed to share. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setShareError(errorMessage);
      onShareError?.(errorMessage); // Call error callback if provided
    } finally {
      setIsSharing(false);
    }
  };

  const errorMessageId = "share-error-message";

  return (
    <div>
      <button
        onClick={handleShare}
        disabled={isSharing}
        aria-label="Share meeting insights on social media"
        aria-busy={isSharing}
        aria-describedby={shareError ? errorMessageId : undefined}
      >
        {isSharing ? sharingText : buttonText}
      </button>
      {shareError && (
        <div
          id={errorMessageId}
          style={{ color: 'red', marginTop: '0.5em', padding: '0.5em', border: '1px solid red', borderRadius: '4px' }}
          role="alert"
        >
          {shareError}
        </div>
      )}
    </div>
  );
};

export default SocialMediaShare;