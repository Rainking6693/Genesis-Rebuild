import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

interface BusinessSpecification {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'archived';
  sections: SpecificationSection[];
}

interface SpecificationSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface BusinessSpecificationComponentProps {
  initialSpecification?: BusinessSpecification;
  onSave: (specification: BusinessSpecification) => void;
  onError: (message: string) => void;
  readOnly?: boolean;
}

const BusinessSpecificationComponent: React.FC<BusinessSpecificationComponentProps> = ({
  initialSpecification,
  onSave,
  onError,
  readOnly = false,
}) => {
  const [specification, setSpecification] = useState<BusinessSpecification>(
    initialSpecification || createDefaultSpecification()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<SpecificationSection[]>(
    initialSpecification?.sections || []
  );
  const debouncedSaveRef = useRef(
    debounce(() => {
      handleSave();
    }, 500)
  );

  useEffect(() => {
    if (initialSpecification) {
      setSpecification(initialSpecification);
      setSections(initialSpecification.sections);
    } else {
      setSpecification(createDefaultSpecification());
      setSections([]);
    }
  }, [initialSpecification]);

  const createDefaultSpecification = (): BusinessSpecification => ({
    id: uuidv4(),
    name: 'New Specification',
    description: '',
    version: '1.0',
    author: 'Unknown',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    sections: [],
  });

  const handleSpecificationChange = (field: keyof BusinessSpecification, value: any) => {
    if (readOnly) return;

    setSpecification((prevSpec) => ({
      ...prevSpec,
      [field]: value,
      updatedAt: new Date(),
    }));
  };

  const handleAddSection = () => {
    if (readOnly) return;

    const newSection: SpecificationSection = {
      id: uuidv4(),
      title: 'New Section',
      content: '',
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const handleSectionChange = (sectionId: string, field: keyof SpecificationSection, value: any) => {
    if (readOnly) return;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const handleRemoveSection = (sectionId: string) => {
    if (readOnly) return;

    setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId));
  };

  const handleSave = async () => {
    if (readOnly) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const specificationToSave: BusinessSpecification = {
        ...specification,
        sections: sections.sort((a, b) => a.order - b.order),
        updatedAt: new Date(),
      };

      onSave(specificationToSave);
    } catch (error: any) {
      console.error('Error saving specification:', error);
      onError(`Failed to save specification: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    debouncedSaveRef.current();
    return () => debouncedSaveRef.current.cancel(); // Cancel any pending saves on unmount
  }, [specification, sections]);

  const handleSectionOrderChange = (sectionId: string, newOrder: number) => {
    if (readOnly) return;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, order: newOrder } : section
      )
    );
  };

  const handleStatusChange = (newStatus: 'draft' | 'active' | 'archived') => {
    if (readOnly) return;

    setSpecification((prevSpec) => ({
      ...prevSpec,
      status: newStatus,
      updatedAt: new Date(),
    }));
  };

  return (
    <div className="business-specification-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="specification-header">
            <label htmlFor="specification-name">Name:</label>
            <input
              type="text"
              id="specification-name"
              value={specification.name}
              onChange={(e) => handleSpecificationChange('name', e.target.value)}
              disabled={readOnly}
              aria-label="Specification Name"
            />

            <label htmlFor="specification-version">Version:</label>
            <input
              type="text"
              id="specification-version"
              value={specification.version}
              onChange={(e) => handleSpecificationChange('version', e.target.value)}
              disabled={readOnly}
              aria-label="Specification Version"
            />

            <label htmlFor="specification-author">Author:</label>
            <input
              type="text"
              id="specification-author"
              value={specification.author}
              onChange={(e) => handleSpecificationChange('author', e.target.value)}
              disabled={readOnly}
              aria-label="Specification Author"
            />

            <label htmlFor="specification-status">Status:</label>
            <select
              id="specification-status"
              value={specification.status}
              onChange={(e) => handleStatusChange(e.target.value as 'draft' | 'active' | 'archived')}
              disabled={readOnly}
              aria-label="Specification Status"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <label htmlFor="specification-description">Description:</label>
          <textarea
            id="specification-description"
            value={specification.description}
            onChange={(e) => handleSpecificationChange('description', e.target.value)}
            disabled={readOnly}
            aria-label="Specification Description"
          />

          <div className="sections-container">
            <h2>Sections</h2>
            {sections.map((section) => (
              <div key={section.id} className="section-item">
                <label htmlFor={`section-title-${section.id}`}>Title:</label>
                <input
                  type="text"
                  id={`section-title-${section.id}`}
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                  disabled={readOnly}
                  aria-label={`Section Title - ${section.title}`}
                />

                <label htmlFor={`section-order-${section.id}`}>Order:</label>
                <input
                  type="number"
                  id={`section-order-${section.id}`}
                  value={section.order}
                  onChange={(e) =>
                    handleSectionOrderChange(section.id, parseInt(e.target.value, 10))
                  }
                  disabled={readOnly}
                  aria-label={`Section Order - ${section.title}`}
                />

                <label htmlFor={`section-content-${section.id}`}>Content:</label>
                <textarea
                  id={`section-content-${section.id}`}
                  value={section.content}
                  onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                  disabled={readOnly}
                  aria-label={`Section Content - ${section.title}`}
                />

                <button
                  onClick={() => handleRemoveSection(section.id)}
                  disabled={readOnly}
                  aria-label={`Remove Section - ${section.title}`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddSection} disabled={readOnly} aria-label="Add Section">
              Add Section
            </button>
          </div>

          <button
            onClick={debouncedSaveRef.current}
            disabled={isSaving || readOnly}
            aria-label="Save Specification"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </>
      )}
    </div>
  );
};

export default BusinessSpecificationComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

interface BusinessSpecification {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'archived';
  sections: SpecificationSection[];
}

interface SpecificationSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface BusinessSpecificationComponentProps {
  initialSpecification?: BusinessSpecification;
  onSave: (specification: BusinessSpecification) => void;
  onError: (message: string) => void;
  readOnly?: boolean;
}

const BusinessSpecificationComponent: React.FC<BusinessSpecificationComponentProps> = ({
  initialSpecification,
  onSave,
  onError,
  readOnly = false,
}) => {
  const [specification, setSpecification] = useState<BusinessSpecification>(
    initialSpecification || createDefaultSpecification()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<SpecificationSection[]>(
    initialSpecification?.sections || []
  );
  const debouncedSaveRef = useRef(
    debounce(() => {
      handleSave();
    }, 500)
  );

  useEffect(() => {
    if (initialSpecification) {
      setSpecification(initialSpecification);
      setSections(initialSpecification.sections);
    } else {
      setSpecification(createDefaultSpecification());
      setSections([]);
    }
  }, [initialSpecification]);

  const createDefaultSpecification = (): BusinessSpecification => ({
    id: uuidv4(),
    name: 'New Specification',
    description: '',
    version: '1.0',
    author: 'Unknown',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    sections: [],
  });

  const handleSpecificationChange = (field: keyof BusinessSpecification, value: any) => {
    if (readOnly) return;

    setSpecification((prevSpec) => ({
      ...prevSpec,
      [field]: value,
      updatedAt: new Date(),
    }));
  };

  const handleAddSection = () => {
    if (readOnly) return;

    const newSection: SpecificationSection = {
      id: uuidv4(),
      title: 'New Section',
      content: '',
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const handleSectionChange = (sectionId: string, field: keyof SpecificationSection, value: any) => {
    if (readOnly) return;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const handleRemoveSection = (sectionId: string) => {
    if (readOnly) return;

    setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId));
  };

  const handleSave = async () => {
    if (readOnly) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const specificationToSave: BusinessSpecification = {
        ...specification,
        sections: sections.sort((a, b) => a.order - b.order),
        updatedAt: new Date(),
      };

      onSave(specificationToSave);
    } catch (error: any) {
      console.error('Error saving specification:', error);
      onError(`Failed to save specification: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    debouncedSaveRef.current();
    return () => debouncedSaveRef.current.cancel(); // Cancel any pending saves on unmount
  }, [specification, sections]);

  const handleSectionOrderChange = (sectionId: string, newOrder: number) => {
    if (readOnly) return;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, order: newOrder } : section
      )
    );
  };

  const handleStatusChange = (newStatus: 'draft' | 'active' | 'archived') => {
    if (readOnly) return;

    setSpecification((prevSpec) => ({
      ...prevSpec,
      status: newStatus,
      updatedAt: new Date(),
    }));
  };

  return (
    <div className="business-specification-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="specification-header">
            <label htmlFor="specification-name">Name:</label>
            <input
              type="text"
              id="specification-name"
              value={specification.name}
              onChange={(e) => handleSpecificationChange('name', e.target.value)}
              disabled={readOnly}
              aria-label="Specification Name"
            />

            <label htmlFor="specification-version">Version:</label>
            <input
              type="text"
              id="specification-version"
              value={specification.version}
              onChange={(e) => handleSpecificationChange('version', e.target.value)}
              disabled={readOnly}
              aria-label="Specification Version"
            />

            <label htmlFor="specification-author">Author:</label>
            <input
              type="text"
              id="specification-author"
              value={specification.author}
              onChange={(e) => handleSpecificationChange('author', e.target.value)}
              disabled={readOnly}
              aria-label="Specification Author"
            />

            <label htmlFor="specification-status">Status:</label>
            <select
              id="specification-status"
              value={specification.status}
              onChange={(e) => handleStatusChange(e.target.value as 'draft' | 'active' | 'archived')}
              disabled={readOnly}
              aria-label="Specification Status"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <label htmlFor="specification-description">Description:</label>
          <textarea
            id="specification-description"
            value={specification.description}
            onChange={(e) => handleSpecificationChange('description', e.target.value)}
            disabled={readOnly}
            aria-label="Specification Description"
          />

          <div className="sections-container">
            <h2>Sections</h2>
            {sections.map((section) => (
              <div key={section.id} className="section-item">
                <label htmlFor={`section-title-${section.id}`}>Title:</label>
                <input
                  type="text"
                  id={`section-title-${section.id}`}
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                  disabled={readOnly}
                  aria-label={`Section Title - ${section.title}`}
                />

                <label htmlFor={`section-order-${section.id}`}>Order:</label>
                <input
                  type="number"
                  id={`section-order-${section.id}`}
                  value={section.order}
                  onChange={(e) =>
                    handleSectionOrderChange(section.id, parseInt(e.target.value, 10))
                  }
                  disabled={readOnly}
                  aria-label={`Section Order - ${section.title}`}
                />

                <label htmlFor={`section-content-${section.id}`}>Content:</label>
                <textarea
                  id={`section-content-${section.id}`}
                  value={section.content}
                  onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                  disabled={readOnly}
                  aria-label={`Section Content - ${section.title}`}
                />

                <button
                  onClick={() => handleRemoveSection(section.id)}
                  disabled={readOnly}
                  aria-label={`Remove Section - ${section.title}`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddSection} disabled={readOnly} aria-label="Add Section">
              Add Section
            </button>
          </div>

          <button
            onClick={debouncedSaveRef.current}
            disabled={isSaving || readOnly}
            aria-label="Save Specification"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </>
      )}
    </div>
  );
};

export default BusinessSpecificationComponent;