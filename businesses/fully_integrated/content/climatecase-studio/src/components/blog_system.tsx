import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface BlogPostProps {
  title: string;
  content: string | React.ReactNode; // Allow content to be a string or React node
  author?: string;
  publishedDate?: Date | string | null; // Allow Date object, string representation, or null
  className?: string; // Allow custom class names for styling
  titleHeadingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Allow control over title heading level
  dateFormat?: string; // Allow custom date formatting
  fallbackAuthorText?: string; // Allow custom fallback author text
  fallbackDateText?: string; // Allow custom fallback date text
  ariaLabel?: string; // Allow custom aria label for the article
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
  className,
  titleHeadingLevel = 'h1',
  dateFormat = 'MMMM d, yyyy',
  fallbackAuthorText = 'Unknown Author',
  fallbackDateText = 'Date not available',
  ariaLabel,
}) => {
  const HeadingTag = titleHeadingLevel as React.ElementType;

  let formattedDate: string | null = null;

  if (publishedDate) {
    let dateObject: Date | null = null;

    if (typeof publishedDate === 'string') {
      try {
        dateObject = parseISO(publishedDate);
      } catch (error) {
        console.error("Error parsing date string:", error);
        dateObject = null;
      }
    } else if (publishedDate instanceof Date) {
      dateObject = publishedDate;
    }

    if (dateObject) {
      try {
        formattedDate = format(dateObject, dateFormat, { locale: enUS });
      } catch (error) {
        console.error("Error formatting date:", error);
        formattedDate = null;
      }
    }
  }

  const authorText = author || fallbackAuthorText;
  const dateText = formattedDate || fallbackDateText;

  return (
    <article className={className} aria-label={ariaLabel}>
      <header>
        <HeadingTag>{title}</HeadingTag>
        {authorText && <p aria-label={`Author: ${authorText}`}>By {authorText}</p>}
        {dateText && <p aria-label={`Published on: ${dateText}`}>Published on {dateText}</p>}
      </header>
      <div>{typeof content === 'string' ? content : content}</div>
    </article>
  );
};

export default BlogPost;

import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface BlogPostProps {
  title: string;
  content: string | React.ReactNode; // Allow content to be a string or React node
  author?: string;
  publishedDate?: Date | string | null; // Allow Date object, string representation, or null
  className?: string; // Allow custom class names for styling
  titleHeadingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Allow control over title heading level
  dateFormat?: string; // Allow custom date formatting
  fallbackAuthorText?: string; // Allow custom fallback author text
  fallbackDateText?: string; // Allow custom fallback date text
  ariaLabel?: string; // Allow custom aria label for the article
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
  className,
  titleHeadingLevel = 'h1',
  dateFormat = 'MMMM d, yyyy',
  fallbackAuthorText = 'Unknown Author',
  fallbackDateText = 'Date not available',
  ariaLabel,
}) => {
  const HeadingTag = titleHeadingLevel as React.ElementType;

  let formattedDate: string | null = null;

  if (publishedDate) {
    let dateObject: Date | null = null;

    if (typeof publishedDate === 'string') {
      try {
        dateObject = parseISO(publishedDate);
      } catch (error) {
        console.error("Error parsing date string:", error);
        dateObject = null;
      }
    } else if (publishedDate instanceof Date) {
      dateObject = publishedDate;
    }

    if (dateObject) {
      try {
        formattedDate = format(dateObject, dateFormat, { locale: enUS });
      } catch (error) {
        console.error("Error formatting date:", error);
        formattedDate = null;
      }
    }
  }

  const authorText = author || fallbackAuthorText;
  const dateText = formattedDate || fallbackDateText;

  return (
    <article className={className} aria-label={ariaLabel}>
      <header>
        <HeadingTag>{title}</HeadingTag>
        {authorText && <p aria-label={`Author: ${authorText}`}>By {authorText}</p>}
        {dateText && <p aria-label={`Published on: ${dateText}`}>Published on {dateText}</p>}
      </header>
      <div>{typeof content === 'string' ? content : content}</div>
    </article>
  );
};

export default BlogPost;