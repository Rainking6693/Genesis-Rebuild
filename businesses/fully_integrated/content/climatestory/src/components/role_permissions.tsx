import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface RolePermissionsProps {
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
  title,
  content,
  userId,
  createdAt,
  updatedAt,
}) => {
  const [id, setId] = useState<string>(uuidv4());
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure unique component instance
    setId(uuidv4());

    // Focus the component on mount for accessibility
    if (componentRef.current) {
      componentRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={componentRef}
      data-component-id={id}
      tabIndex={0}
      role="article"
      aria-label={title}
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <h1>{title || 'Untitled'}</h1>
      <p>{content || 'No content available'}</p>
      <p>User ID: {userId || 'Unknown'}</p>
      <p>Created at: {createdAt ? createdAt.toLocaleString() : 'Unknown'}</p>
      <p>Updated at: {updatedAt ? updatedAt.toLocaleString() : 'Unknown'}</p>
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface RolePermissionsProps {
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
  title,
  content,
  userId,
  createdAt,
  updatedAt,
}) => {
  const [id, setId] = useState<string>(uuidv4());
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure unique component instance
    setId(uuidv4());

    // Focus the component on mount for accessibility
    if (componentRef.current) {
      componentRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={componentRef}
      data-component-id={id}
      tabIndex={0}
      role="article"
      aria-label={title}
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <h1>{title || 'Untitled'}</h1>
      <p>{content || 'No content available'}</p>
      <p>User ID: {userId || 'Unknown'}</p>
      <p>Created at: {createdAt ? createdAt.toLocaleString() : 'Unknown'}</p>
      <p>Updated at: {updatedAt ? updatedAt.toLocaleString() : 'Unknown'}</p>
    </div>
  );
};

export default RolePermissions;