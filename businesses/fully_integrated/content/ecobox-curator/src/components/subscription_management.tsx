import React, { FC, useMemo, useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

interface Props {
  message: string;
  onMessageChange?: (message: string) => void;
}

const SubscriptionManagement: FC<Props> = forwardRef<HTMLDivElement, Props>(({ message, onMessageChange, ...rest }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    if (!editing) {
      setEditing(true);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [editing]);

  const handleSaveClick = useCallback(() => {
    if (onMessageChange) {
      onMessageChange(inputRef.current?.value || '');
      setEditing(false);
    }
  }, [onMessageChange]);

  const handleCancelClick = useCallback(() => {
    setEditing(false);
    if (onMessageChange) {
      onMessageChange(message);
    }
  }, [message, onMessageChange]);

  const memoizedComponent = useMemo(() => (
    <div className="subscription-management" aria-label="Subscription Management">
      {editing ? (
        <>
          <input type="text" ref={inputRef} defaultValue={message} />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </>
      ) : (
        <div onClick={handleEditClick}>{message}</div>
      )}
    </div>
  ), [editing, message]);

  return memoizedComponent;
});

SubscriptionManagement.displayName = 'SubscriptionManagement';

SubscriptionManagement.defaultProps = {
  message: 'Welcome to EcoBox Curator Subscription Management',
  onMessageChange: undefined,
};

SubscriptionManagement.propTypes = {
  message: PropTypes.string.isRequired,
  onMessageChange: PropTypes.func,
};

SubscriptionManagement.validate = (props: Props) => {
  if (!props.message) {
    throw new Error('"message" is required');
  }
};

export default SubscriptionManagement;

In this version, I've added the ability to edit the message by making it clickable and adding an input field for editing. I've also added an `onMessageChange` prop to allow the parent component to update the message when it's edited. Additionally, I've added a `useRef` for the input field to improve accessibility when editing the message.