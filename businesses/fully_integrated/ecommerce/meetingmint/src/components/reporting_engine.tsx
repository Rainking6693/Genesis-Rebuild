import React, { FC, useEffect, useState } from 'react';

interface Props {
  meetingId: string;
  meetingNotes?: string | null; // Added nullable type for meetingNotes
  actionItems?: Array<{ id: string, description: string, assignee: string } | null> | null; // Added nullable type for actionItems and made it an array
}

const ReportingEngine: FC<Props> = ({ meetingId, meetingNotes, actionItems }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Implement your API call logic here
        // ...
        // Update state with the fetched data
        // ...
      } catch (err) {
        setError(err);
      }

      setIsLoading(false);
    };

    if (meetingId) {
      fetchData();
    }
  }, [meetingId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!meetingId) {
    return <div>No meeting ID provided.</div>;
  }

  if (!meetingNotes) {
    meetingNotes = '';
  }

  if (!actionItems || !actionItems.length) {
    actionItems = [];
  }

  return (
    <div>
      <h2>Meeting Report for {meetingId}</h2>
      <h3>Notes:</h3>
      <p>{meetingNotes}</p>
      <h3>Action Items:</h3>
      <ul role="list">
        {actionItems.map((item) => {
          if (!item) return null;
          return (
            <li key={item.id}>
              <strong>{item.assignee || 'Assignee not provided'}:</strong> {item.description || 'Description not provided'}
            </li>
          );
        })}
        {!actionItems.length && <li>No action items found.</li>}
      </ul>
    </div>
  );
};

export default ReportingEngine;

Changes made:

1. Added nullable types for `meetingNotes` and `actionItems`.
2. Checked if `meetingId` is provided before rendering the component.
3. Provided default values for `meetingNotes` and `actionItems` when they are not provided.
4. Improved accessibility by adding a role attribute to the unordered list (`<ul>`).
5. Checked if `item` is provided before rendering each action item.
6. Provided default values for `assignee` and `description` when they are not provided.

This updated code ensures that the component can handle edge cases more gracefully, improves accessibility, and makes the code more maintainable.