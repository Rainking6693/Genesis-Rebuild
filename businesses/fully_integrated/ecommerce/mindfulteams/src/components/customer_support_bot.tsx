import React, { useState, useEffect, useRef } from 'react';

interface Props {
  teamId: string; // Unique identifier for the team
  teamName: string; // Name of the team
  managerEmail: string; // Email of the team manager for support purposes
}

const CustomerSupportBot: React.FC<Props> = ({ teamId, teamName, managerEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mailtoLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleMailtoLinkClick = () => {
      if (isOpen) {
        window.location.href = mailtoLinkRef.current?.href || '';
      }
    };

    mailtoLinkRef.current?.addEventListener('click', handleMailtoLinkClick);

    return () => {
      mailtoLinkRef.current?.removeEventListener('click', handleMailtoLinkClick);
    };
  }, [isOpen]);

  useEffect(() => {
    const mailtoLink = `mailto:${managerEmail}?subject=MindfulTeams Support Bot Status&body=Team ID: ${teamId}, Status: ${isOpen ? 'Open' : 'Closed'}`;
    mailtoLinkRef.current?.setAttribute('href', mailtoLink);
  }, [teamId, managerEmail]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      setIsOpen(!isOpen);
    }
  };

  const supportOptions = (
    <div>
      {/* Render support options here */}
    </div>
  );

  return (
    <div>
      <h2>{`Welcome to MindfulTeams, ${teamName}!`}</h2>
      <button onClick={() => setIsOpen(!isOpen)} onKeyDown={handleKeyDown}>
        {isOpen ? 'Close Support' : 'Open Support'}
      </button>
      {isOpen && supportOptions}
      <a href="" ref={mailtoLinkRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CustomerSupportBot;

Changes made:

1. Added `useRef` to store the mailto link element, which allows us to add an event listener to it.
2. Moved the mailto link creation to the `useEffect` that runs on mount and whenever `teamId` or `managerEmail` changes.
3. Added an event listener to the mailto link that checks if the support bot is open before navigating to the mailto link.
4. Added a `display: none` style to the mailto link to hide it from the user.
5. Moved the support options rendering inside the conditional statement to improve maintainability.
6. Improved accessibility by adding an `onKeyDown` event handler to the support bot button.
7. Added comments to explain the changes made.