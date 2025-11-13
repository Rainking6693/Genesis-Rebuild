import React, { Key, ReactNode } from 'react';

interface Props {
  title: string; // Add a more descriptive property name for better understanding of the component's purpose
  subtitle?: string; // Add an optional subtitle for potential future use
  courses: Course[]; // Define a type for the courses array to ensure consistency and maintainability
}

interface Course {
  id: string;
  title: string;
  creator: string;
  industry: string;
  level: string;
  format: 'physical' | 'digital'; // Define enumerable types for clarity and consistency
  exclusiveContent: boolean;
}

// Add a default value for subtitle to handle edge cases
const ProductCatalog: React.FC<Props> = ({ title, subtitle = '', courses }) => {
  // Validate the courses array to ensure it's not empty before rendering
  if (!courses.length) {
    return <div>No courses found.</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      <ul role="list"> // Add role attribute for accessibility
        <AccessibleList items={courses.map((course) => createAccessibleListItem(course))} />
      </ul>
    </div>
  );
};

// Create a reusable AccessibleList component for better maintainability
const AccessibleList = ({ items }: { items: ReactNode[] }) => (
  <ul role="list">
    {items}
  </ul>
);

// Create a reusable AccessibleListItem component for better maintainability
const createAccessibleListItem = (course: Course): ReactNode => (
  <li key={course.id} role="listitem">
    <a href={`/course/${course.id}`}>
      {course.title} by {course.creator}
      <CourseDetails course={course} />
    </a>
  </li>
);

// Create a reusable CourseDetails component for better maintainability
const CourseDetails = ({ course }: { course: Course }) => {
  const { industry, level, format, exclusiveContent } = course;

  return (
    <>
      <span> (Industry: {industry}, Level: {level}, Format: {format}, Exclusive Content: {exclusiveContent})</span>
    </>
  );
};

export default ProductCatalog;

import React, { Key, ReactNode } from 'react';

interface Props {
  title: string; // Add a more descriptive property name for better understanding of the component's purpose
  subtitle?: string; // Add an optional subtitle for potential future use
  courses: Course[]; // Define a type for the courses array to ensure consistency and maintainability
}

interface Course {
  id: string;
  title: string;
  creator: string;
  industry: string;
  level: string;
  format: 'physical' | 'digital'; // Define enumerable types for clarity and consistency
  exclusiveContent: boolean;
}

// Add a default value for subtitle to handle edge cases
const ProductCatalog: React.FC<Props> = ({ title, subtitle = '', courses }) => {
  // Validate the courses array to ensure it's not empty before rendering
  if (!courses.length) {
    return <div>No courses found.</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      <ul role="list"> // Add role attribute for accessibility
        <AccessibleList items={courses.map((course) => createAccessibleListItem(course))} />
      </ul>
    </div>
  );
};

// Create a reusable AccessibleList component for better maintainability
const AccessibleList = ({ items }: { items: ReactNode[] }) => (
  <ul role="list">
    {items}
  </ul>
);

// Create a reusable AccessibleListItem component for better maintainability
const createAccessibleListItem = (course: Course): ReactNode => (
  <li key={course.id} role="listitem">
    <a href={`/course/${course.id}`}>
      {course.title} by {course.creator}
      <CourseDetails course={course} />
    </a>
  </li>
);

// Create a reusable CourseDetails component for better maintainability
const CourseDetails = ({ course }: { course: Course }) => {
  const { industry, level, format, exclusiveContent } = course;

  return (
    <>
      <span> (Industry: {industry}, Level: {level}, Format: {format}, Exclusive Content: {exclusiveContent})</span>
    </>
  );
};

export default ProductCatalog;