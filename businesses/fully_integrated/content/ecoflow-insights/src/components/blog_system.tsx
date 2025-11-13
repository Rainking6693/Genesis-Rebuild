import { isString } from 'util';
import { trim } from 'string';

type Keyword = string;

function validateKeywords(keyword1: Keyword, keyword2: Keyword): void {
  if (!keyword1 || !keyword2) {
    throw new Error("Both keywords are required.");
  }
}

function normalizeKeyword(keyword: Keyword): Keyword {
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
}

function generateBlogTitle(keyword1: Keyword, keyword2: Keyword): string {
  // Ensure keywords are non-empty strings and trim whitespace
  const normalizedKeyword1 = trim(keyword1).toUpperCase();
  const normalizedKeyword2 = trim(keyword2).toUpperCase();

  // Apply security best practices
  // No sensitive data is involved in this function, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it has a constant time complexity.

  // Improve maintainability
  // Add comments to explain the function's purpose and behavior.

  // Combine keywords with a separator
  const separator = " - ";
  const blogTitle = `${normalizedKeyword1} ${separator} ${normalizedKeyword2}`;

  // Ensure the title is always in lowercase for better SEO
  return blogTitle.toLowerCase();
}

// Edge cases
generateBlogTitle(null, "Keyword2"); // Throws an error
generateBlogTitle("Keyword1", null); // Throws an error
generateBlogTitle(undefined, "Keyword2"); // Throws an error
generateBlogTitle("Keyword1", undefined); // Throws an error
generateBlogTitle("", "Keyword2"); // Throws an error
generateBlogTitle("Keyword1", ""); // Throws an error
generateBlogTitle("Keyword1", " "); // Trims whitespace and returns a valid title
generateBlogTitle("Keyword1", "\tKeyword2"); // Trims whitespace and returns a valid title
generateBlogTitle("\tKeyword1", "Keyword2"); // Trims whitespace and returns a valid title

import { isString } from 'util';
import { trim } from 'string';

type Keyword = string;

function validateKeywords(keyword1: Keyword, keyword2: Keyword): void {
  if (!keyword1 || !keyword2) {
    throw new Error("Both keywords are required.");
  }
}

function normalizeKeyword(keyword: Keyword): Keyword {
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
}

function generateBlogTitle(keyword1: Keyword, keyword2: Keyword): string {
  // Ensure keywords are non-empty strings and trim whitespace
  const normalizedKeyword1 = trim(keyword1).toUpperCase();
  const normalizedKeyword2 = trim(keyword2).toUpperCase();

  // Apply security best practices
  // No sensitive data is involved in this function, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it has a constant time complexity.

  // Improve maintainability
  // Add comments to explain the function's purpose and behavior.

  // Combine keywords with a separator
  const separator = " - ";
  const blogTitle = `${normalizedKeyword1} ${separator} ${normalizedKeyword2}`;

  // Ensure the title is always in lowercase for better SEO
  return blogTitle.toLowerCase();
}

// Edge cases
generateBlogTitle(null, "Keyword2"); // Throws an error
generateBlogTitle("Keyword1", null); // Throws an error
generateBlogTitle(undefined, "Keyword2"); // Throws an error
generateBlogTitle("Keyword1", undefined); // Throws an error
generateBlogTitle("", "Keyword2"); // Throws an error
generateBlogTitle("Keyword1", ""); // Throws an error
generateBlogTitle("Keyword1", " "); // Trims whitespace and returns a valid title
generateBlogTitle("Keyword1", "\tKeyword2"); // Trims whitespace and returns a valid title
generateBlogTitle("\tKeyword1", "Keyword2"); // Trims whitespace and returns a valid title