import React, { FunctionComponent, useState, useRef, Dispatch, SetStateAction, FocusEvent, KeyboardEvent } from 'react';

interface Props {
  message: string;
  referralCode?: string;
  onReferralCodeChange?: (code: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

const ReferralSystem: FunctionComponent<Props> = ({ message, referralCode, onReferralCodeChange, onInputFocus, onInputBlur }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(referralCode || '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onReferralCodeChange) {
      onReferralCodeChange(event.target.value);
    }
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (onReferralCodeChange) {
      onReferralCodeChange(inputValue);
    }
    if (onInputBlur) {
      onInputBlur();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleInputBlur(event);
    }
  };

  const handleInputFocus = () => {
    if (onInputFocus) {
      onInputFocus();
    }
  };

  return (
    <div>
      <div>{message}</div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        onFocus={handleInputFocus}
        ref={inputRef}
      />
    </div>
  );
};

export default ReferralSystem;

import React, { FunctionComponent, useState, useRef, Dispatch, SetStateAction, FocusEvent, KeyboardEvent } from 'react';

interface Props {
  message: string;
  referralCode?: string;
  onReferralCodeChange?: (code: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

const ReferralSystem: FunctionComponent<Props> = ({ message, referralCode, onReferralCodeChange, onInputFocus, onInputBlur }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(referralCode || '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onReferralCodeChange) {
      onReferralCodeChange(event.target.value);
    }
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (onReferralCodeChange) {
      onReferralCodeChange(inputValue);
    }
    if (onInputBlur) {
      onInputBlur();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleInputBlur(event);
    }
  };

  const handleInputFocus = () => {
    if (onInputFocus) {
      onInputFocus();
    }
  };

  return (
    <div>
      <div>{message}</div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        onFocus={handleInputFocus}
        ref={inputRef}
      />
    </div>
  );
};

export default ReferralSystem;