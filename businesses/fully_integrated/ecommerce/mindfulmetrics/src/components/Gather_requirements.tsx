import React, { useState, useEffect, useCallback } from 'react';

interface Requirement {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in progress' | 'completed' | 'blocked';
  owner: string;
  notes?: string;
}

interface RequirementsComponentProps {
  initialRequirements?: Requirement[];
  fetchRequirements: () => Promise<Requirement[]>;
  onRequirementUpdate?: (updatedRequirement: Requirement) => Promise<void>; // Optional callback for updating requirements
  onRequirementCreate?: (newRequirement: Omit<Requirement, 'id'>) => Promise<Requirement>; // Optional callback for creating requirements
  debounceDelay?: number; // Debounce delay for search input (milliseconds)
}

const RequirementsComponent: React.FC<RequirementsComponentProps> = ({
  initialRequirements = [],
  fetchRequirements,
  onRequirementUpdate,
  onRequirementCreate,
  debounceDelay = 300,
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newRequirementDescription, setNewRequirementDescription] = useState('');
  const [newRequirementPriority, setNewRequirementPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newRequirementOwner, setNewRequirementOwner] = useState('');

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timerId);
  }, [searchTerm, debounceDelay]);

  const loadRequirements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRequirements = await fetchRequirements();
      setRequirements(fetchedRequirements);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load requirements');
      console.error('Error loading requirements:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRequirements]);

  useEffect(() => {
    loadRequirements();
  }, [loadRequirements]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRequirements = requirements.filter((req) =>
    req.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleRequirementUpdate = async (updatedRequirement: Requirement) => {
    if (onRequirementUpdate) {
      try {
        await onRequirementUpdate(updatedRequirement);
        // Optimistically update the UI
        setRequirements((prevRequirements) =>
          prevRequirements.map((req) => (req.id === updatedRequirement.id ? updatedRequirement : req))
        );
      } catch (error) {
        console.error('Failed to update requirement:', error);
        setError(new Error('Failed to update requirement. Please try again.'));
        // Optionally, revert the UI update if the update fails.
        loadRequirements(); // Reload data to ensure consistency
      }
    } else {
      console.warn('onRequirementUpdate prop not provided.  UI will not be updated.');
    }
  };

  const handleCreateRequirementClick = () => {
    setIsCreating(true);
  };

  const handleCreateRequirementCancel = () => {
    setIsCreating(false);
    setNewRequirementDescription('');
    setNewRequirementPriority('medium');
    setNewRequirementOwner('');
  };

  const handleNewRequirementDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewRequirementDescription(event.target.value);
  };

  const handleNewRequirementPriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRequirementPriority(event.target.value as 'high' | 'medium' | 'low');
  };

  const handleNewRequirementOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRequirementOwner(event.target.value);
  };

  const handleCreateRequirementSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newRequirementDescription.trim() || !newRequirementOwner.trim()) {
      alert('Description and Owner are required.'); // Basic validation
      return;
    }

    if (onRequirementCreate) {
      try {
        const newRequirement: Omit<Requirement, 'id'> = {
          description: newRequirementDescription,
          priority: newRequirementPriority,
          status: 'open',
          owner: newRequirementOwner,
        };

        const createdRequirement = await onRequirementCreate(newRequirement);

        setRequirements((prevRequirements) => [...prevRequirements, createdRequirement]);
        setIsCreating(false);
        setNewRequirementDescription('');
        setNewRequirementPriority('medium');
        setNewRequirementOwner('');
      } catch (error) {
        console.error('Failed to create requirement:', error);
        setError(new Error('Failed to create requirement. Please try again.'));
      }
    } else {
      console.warn('onRequirementCreate prop not provided. Requirement will not be created.');
    }
  };

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        Loading requirements...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <h2>Error</h2>
        <p>{error.message}</p>
        <button onClick={loadRequirements}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="search">Search Requirements:</label>
      <input
        type="search"
        id="search"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={handleSearchChange}
        aria-label="Search requirements"
      />

      <h2>Requirements</h2>

      {filteredRequirements.length === 0 && debouncedSearchTerm && (
        <p>No requirements found matching "{debouncedSearchTerm}"</p>
      )}

      <ul>
        {filteredRequirements.map((requirement) => (
          <RequirementItem
            key={requirement.id}
            requirement={requirement}
            onUpdate={handleRequirementUpdate}
          />
        ))}
      </ul>

      {!isCreating && (
        <button onClick={handleCreateRequirementClick}>Create New Requirement</button>
      )}

      {isCreating && (
        <form onSubmit={handleCreateRequirementSubmit}>
          <label htmlFor="newDescription">Description:</label>
          <textarea
            id="newDescription"
            value={newRequirementDescription}
            onChange={handleNewRequirementDescriptionChange}
            required
            aria-required="true"
          />

          <label htmlFor="newPriority">Priority:</label>
          <select
            id="newPriority"
            value={newRequirementPriority}
            onChange={handleNewRequirementPriorityChange}
            aria-label="Priority"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <label htmlFor="newOwner">Owner:</label>
          <input
            type="text"
            id="newOwner"
            value={newRequirementOwner}
            onChange={handleNewRequirementOwnerChange}
            required
            aria-required="true"
          />

          <button type="submit">Create</button>
          <button type="button" onClick={handleCreateRequirementCancel}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

interface RequirementItemProps {
  requirement: Requirement;
  onUpdate: (updatedRequirement: Requirement) => void;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ requirement, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localRequirement, setLocalRequirement] = useState({ ...requirement });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setLocalRequirement((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setLocalRequirement({ ...requirement }); // Revert to original values
  };

  const handleSaveClick = () => {
    onUpdate(localRequirement);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <label htmlFor={`description-${requirement.id}`}>Description:</label>
          <textarea
            id={`description-${requirement.id}`}
            name="description"
            value={localRequirement.description}
            onChange={handleInputChange}
            aria-label="Description"
          />

          <label htmlFor={`priority-${requirement.id}`}>Priority:</label>
          <select
            id={`priority-${requirement.id}`}
            name="priority"
            value={localRequirement.priority}
            onChange={handleInputChange}
            aria-label="Priority"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <label htmlFor={`status-${requirement.id}`}>Status:</label>
          <select
            id={`status-${requirement.id}`}
            name="status"
            value={localRequirement.status}
            onChange={handleInputChange}
            aria-label="Status"
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          <label htmlFor={`owner-${requirement.id}`}>Owner:</label>
          <input
            type="text"
            id={`owner-${requirement.id}`}
            name="owner"
            value={localRequirement.owner}
            onChange={handleInputChange}
            aria-label="Owner"
          />

          <label htmlFor={`notes-${requirement.id}`}>Notes:</label>
          <textarea
            id={`notes-${requirement.id}`}
            name="notes"
            value={localRequirement.notes || ''}
            onChange={handleInputChange}
            aria-label="Notes"
          />

          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Description: {requirement.description}</p>
          <p>Priority: {requirement.priority}</p>
          <p>Status: {requirement.status}</p>
          <p>Owner: {requirement.owner}</p>
          {requirement.notes && <p>Notes: {requirement.notes}</p>}
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </li>
  );
};

export default RequirementsComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface Requirement {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in progress' | 'completed' | 'blocked';
  owner: string;
  notes?: string;
}

interface RequirementsComponentProps {
  initialRequirements?: Requirement[];
  fetchRequirements: () => Promise<Requirement[]>;
  onRequirementUpdate?: (updatedRequirement: Requirement) => Promise<void>; // Optional callback for updating requirements
  onRequirementCreate?: (newRequirement: Omit<Requirement, 'id'>) => Promise<Requirement>; // Optional callback for creating requirements
  debounceDelay?: number; // Debounce delay for search input (milliseconds)
}

const RequirementsComponent: React.FC<RequirementsComponentProps> = ({
  initialRequirements = [],
  fetchRequirements,
  onRequirementUpdate,
  onRequirementCreate,
  debounceDelay = 300,
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newRequirementDescription, setNewRequirementDescription] = useState('');
  const [newRequirementPriority, setNewRequirementPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newRequirementOwner, setNewRequirementOwner] = useState('');

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timerId);
  }, [searchTerm, debounceDelay]);

  const loadRequirements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRequirements = await fetchRequirements();
      setRequirements(fetchedRequirements);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load requirements');
      console.error('Error loading requirements:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRequirements]);

  useEffect(() => {
    loadRequirements();
  }, [loadRequirements]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRequirements = requirements.filter((req) =>
    req.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleRequirementUpdate = async (updatedRequirement: Requirement) => {
    if (onRequirementUpdate) {
      try {
        await onRequirementUpdate(updatedRequirement);
        // Optimistically update the UI
        setRequirements((prevRequirements) =>
          prevRequirements.map((req) => (req.id === updatedRequirement.id ? updatedRequirement : req))
        );
      } catch (error) {
        console.error('Failed to update requirement:', error);
        setError(new Error('Failed to update requirement. Please try again.'));
        // Optionally, revert the UI update if the update fails.
        loadRequirements(); // Reload data to ensure consistency
      }
    } else {
      console.warn('onRequirementUpdate prop not provided.  UI will not be updated.');
    }
  };

  const handleCreateRequirementClick = () => {
    setIsCreating(true);
  };

  const handleCreateRequirementCancel = () => {
    setIsCreating(false);
    setNewRequirementDescription('');
    setNewRequirementPriority('medium');
    setNewRequirementOwner('');
  };

  const handleNewRequirementDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewRequirementDescription(event.target.value);
  };

  const handleNewRequirementPriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRequirementPriority(event.target.value as 'high' | 'medium' | 'low');
  };

  const handleNewRequirementOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRequirementOwner(event.target.value);
  };

  const handleCreateRequirementSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newRequirementDescription.trim() || !newRequirementOwner.trim()) {
      alert('Description and Owner are required.'); // Basic validation
      return;
    }

    if (onRequirementCreate) {
      try {
        const newRequirement: Omit<Requirement, 'id'> = {
          description: newRequirementDescription,
          priority: newRequirementPriority,
          status: 'open',
          owner: newRequirementOwner,
        };

        const createdRequirement = await onRequirementCreate(newRequirement);

        setRequirements((prevRequirements) => [...prevRequirements, createdRequirement]);
        setIsCreating(false);
        setNewRequirementDescription('');
        setNewRequirementPriority('medium');
        setNewRequirementOwner('');
      } catch (error) {
        console.error('Failed to create requirement:', error);
        setError(new Error('Failed to create requirement. Please try again.'));
      }
    } else {
      console.warn('onRequirementCreate prop not provided. Requirement will not be created.');
    }
  };

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        Loading requirements...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <h2>Error</h2>
        <p>{error.message}</p>
        <button onClick={loadRequirements}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="search">Search Requirements:</label>
      <input
        type="search"
        id="search"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={handleSearchChange}
        aria-label="Search requirements"
      />

      <h2>Requirements</h2>

      {filteredRequirements.length === 0 && debouncedSearchTerm && (
        <p>No requirements found matching "{debouncedSearchTerm}"</p>
      )}

      <ul>
        {filteredRequirements.map((requirement) => (
          <RequirementItem
            key={requirement.id}
            requirement={requirement}
            onUpdate={handleRequirementUpdate}
          />
        ))}
      </ul>

      {!isCreating && (
        <button onClick={handleCreateRequirementClick}>Create New Requirement</button>
      )}

      {isCreating && (
        <form onSubmit={handleCreateRequirementSubmit}>
          <label htmlFor="newDescription">Description:</label>
          <textarea
            id="newDescription"
            value={newRequirementDescription}
            onChange={handleNewRequirementDescriptionChange}
            required
            aria-required="true"
          />

          <label htmlFor="newPriority">Priority:</label>
          <select
            id="newPriority"
            value={newRequirementPriority}
            onChange={handleNewRequirementPriorityChange}
            aria-label="Priority"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <label htmlFor="newOwner">Owner:</label>
          <input
            type="text"
            id="newOwner"
            value={newRequirementOwner}
            onChange={handleNewRequirementOwnerChange}
            required
            aria-required="true"
          />

          <button type="submit">Create</button>
          <button type="button" onClick={handleCreateRequirementCancel}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

interface RequirementItemProps {
  requirement: Requirement;
  onUpdate: (updatedRequirement: Requirement) => void;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ requirement, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localRequirement, setLocalRequirement] = useState({ ...requirement });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setLocalRequirement((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setLocalRequirement({ ...requirement }); // Revert to original values
  };

  const handleSaveClick = () => {
    onUpdate(localRequirement);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <label htmlFor={`description-${requirement.id}`}>Description:</label>
          <textarea
            id={`description-${requirement.id}`}
            name="description"
            value={localRequirement.description}
            onChange={handleInputChange}
            aria-label="Description"
          />

          <label htmlFor={`priority-${requirement.id}`}>Priority:</label>
          <select
            id={`priority-${requirement.id}`}
            name="priority"
            value={localRequirement.priority}
            onChange={handleInputChange}
            aria-label="Priority"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <label htmlFor={`status-${requirement.id}`}>Status:</label>
          <select
            id={`status-${requirement.id}`}
            name="status"
            value={localRequirement.status}
            onChange={handleInputChange}
            aria-label="Status"
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          <label htmlFor={`owner-${requirement.id}`}>Owner:</label>
          <input
            type="text"
            id={`owner-${requirement.id}`}
            name="owner"
            value={localRequirement.owner}
            onChange={handleInputChange}
            aria-label="Owner"
          />

          <label htmlFor={`notes-${requirement.id}`}>Notes:</label>
          <textarea
            id={`notes-${requirement.id}`}
            name="notes"
            value={localRequirement.notes || ''}
            onChange={handleInputChange}
            aria-label="Notes"
          />

          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Description: {requirement.description}</p>
          <p>Priority: {requirement.priority}</p>
          <p>Status: {requirement.status}</p>
          <p>Owner: {requirement.owner}</p>
          {requirement.notes && <p>Notes: {requirement.notes}</p>}
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </li>
  );
};

export default RequirementsComponent;