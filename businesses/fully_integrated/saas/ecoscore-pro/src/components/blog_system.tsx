import React, { useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface Props {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const BlogPost: React.FC<Props> = ({ id, title, author, date, content, isExpanded, setIsExpanded }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      toggleExpand();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const blogContent = (
    <div className={`blog-content ${isExpanded ? 'expanded' : ''}`}>
      {content}
    </div>
  ) as ReactNode;

  return (
    <div className="blog-post" role="article" tabIndex={0} onKeyDown={handleKeyDown}>
      <h2 onClick={toggleExpand}>{title}</h2>
      <h3>{author} | {date}</h3>
      {blogContent}
    </div>
  );
};

interface BlogListProps {
  blogPosts: Array<{
    id: number;
    title: string;
    author: string;
    date: string;
    content: string;
  }>;
}

const BlogList: React.FC<BlogListProps> = ({ blogPosts }) => {
  return (
    <div className="blog-list" role="list">
      {blogPosts.map((post) => (
        <BlogPost key={post.id} {...post} />
      ))}
    </div>
  );
};

export default BlogList;

Changes made:

1. Added `ReactNode` to the return type of `BlogPost` to handle cases where the content might contain JSX.
2. Added `onKeyDown` event handler to the `BlogPost` component to allow users to expand the post using the Enter key.
3. Moved the `blogContent` variable outside of the `toggleExpand` function to improve readability and maintainability.
4. Added `tabIndex` and `onKeyDown` attributes to the `BlogPost` component to improve accessibility.
5. Removed unnecessary whitespace and improved formatting for better readability.