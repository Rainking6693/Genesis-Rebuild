import { SocialMediaApi } from './SocialMediaApi';

type UserId = number;
type SanitizeContent = (content: string) => string;

export function postMentalWellnessContent(
  userIds: UserId[],
  content: string,
  sanitizeContent: SanitizeContent
): Promise<void> {
  if (!Array.isArray(userIds) || userIds.length === 0 || !content || !sanitizeContent) {
    throw new Error('Invalid parameters provided');
  }

  // Ensure userIds are unique and positive, and within a reasonable range
  const uniqueUserIds = new Set(userIds);
  if (userIds.length !== uniqueUserIds.size) {
    throw new Error('Duplicate user IDs provided');
  }
  if (userIds.some(id => id <= 0 || id > Number.MAX_SAFE_INTEGER)) {
    throw new Error('All user IDs must be positive integers within a reasonable range');
  }

  // Sanitize content to prevent potential security issues
  const sanitizedContent = sanitizeContent(content);

  // Check if socialMediaApi is defined before making the API call
  if (!socialMediaApi) {
    throw new Error('socialMediaApi not found');
  }

  return socialMediaApi.postContentToUsers(userIds, sanitizedContent)
    .then(() => {
      // Log the successful posting of content for auditing purposes
      console.log(`Successfully posted mental wellness content to ${userIds.join(', ')}`);
    })
    .catch((error) => {
      // Handle potential errors from the API call
      console.error(`Error posting mental wellness content to users: ${error.message}`);
      throw error;
    });
}

function sanitizeContent(content: string): string {
  // Implement a function to sanitize user-provided content
  // This function should remove any potentially harmful HTML tags, script tags, or other malicious content
  // For the sake of this example, we'll remove HTML tags, attributes, and script tags
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/([\w-]+:)?\/\/\/[\w#!$%&'*+.^-_=|;:@]+(\/[\w#!$%&'*+.^-_=|;:@]+)*(\?[^<>]*|)/g, '')
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/g, '');
}

This version of the function now accepts a `sanitizeContent` function as a parameter, making it more flexible and maintainable. The error messages have been improved to provide more context, and the function is more resilient to edge cases. The sanitization function has been made more robust by removing more potential security issues.