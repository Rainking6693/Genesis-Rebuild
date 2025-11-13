import React, { useState, Dispatch, SetStateAction, RefObject, useRef } from 'react';

interface Props {
  onClose?: () => void;
}

const Button: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, children, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const Modal: React.FC<Props> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose && onClose();
    }
  };

  React.useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  React.useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        event.stopPropagation();
      }
      handleKeyDown(event as React.KeyboardEvent<HTMLDivElement>);
    };

    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [modalRef]);

  return (
    <div
      ref={modalRef}
      className="modal"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {/* Define modal styles using CSS modules */}
      <header id="modal-title">
        <h2>Start Your Sustainability Challenge!</h2>
      </header>
      <button onClick={onClose} tabIndex={0}>Close</button>
    </div>
  );
};

const MyComponent: React.FC<Props> = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    // Validate user input before opening the modal
    if (onClose && confirm('Are you sure you want to start the challenge?')) {
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <Button onClick={handleClick} disabled={!onClose}>Start Challenge</Button>
      {isModalOpen && <Modal onClose={handleClick} />}
    </div>
  );
};

export default MyComponent;

import React, { useState, Dispatch, SetStateAction, RefObject, useRef } from 'react';

interface Props {
  onClose?: () => void;
}

const Button: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, children, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const Modal: React.FC<Props> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose && onClose();
    }
  };

  React.useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  React.useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        event.stopPropagation();
      }
      handleKeyDown(event as React.KeyboardEvent<HTMLDivElement>);
    };

    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [modalRef]);

  return (
    <div
      ref={modalRef}
      className="modal"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {/* Define modal styles using CSS modules */}
      <header id="modal-title">
        <h2>Start Your Sustainability Challenge!</h2>
      </header>
      <button onClick={onClose} tabIndex={0}>Close</button>
    </div>
  );
};

const MyComponent: React.FC<Props> = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    // Validate user input before opening the modal
    if (onClose && confirm('Are you sure you want to start the challenge?')) {
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <Button onClick={handleClick} disabled={!onClose}>Start Challenge</Button>
      {isModalOpen && <Modal onClose={handleClick} />}
    </div>
  );
};

export default MyComponent;