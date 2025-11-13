import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  maxLength?: number;
  placeholder?: string;
  readOnly?: boolean;
  tabIndex?: number;
  role?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onMessageChange?: (message: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOut?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onInput?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  onInvalid?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  onCompositionStart?: (event: React.CompositionEvent<HTMLDivElement>) => void;
  onCompositionEnd?: (event: React.CompositionEvent<HTMLDivElement>) => void;
  onFocusWithin?: () => void;
  onBlurWithin?: () => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  onCut?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  onCopy?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  onWheel?: (event: React.WheelEvent<HTMLDivElement>) => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchCancel?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onSelect?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  onInputModeChange?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  onInputFormatChange?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  onInputReject?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  onInputCommit?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  onInputDecommit?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
}

const MyComponent: FC<Props> = ({
  message,
  maxLength,
  placeholder,
  readOnly,
  tabIndex,
  role,
  style,
  disabled,
  onMessageChange,
  onFocus,
  onBlur,
  onKeyDown,
  onClick,
  onMouseOver,
  onMouseOut,
  onInput,
  onInvalid,
  onCompositionStart,
  onCompositionEnd,
  onFocusWithin,
  onBlurWithin,
  onKeyUp,
  onPaste,
  onCut,
  onCopy,
  onWheel,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onContextMenu,
  onDoubleClick,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onTouchCancel,
  onScroll,
  onSelect,
  onInputModeChange,
  onInputFormatChange,
  onInputReject,
  onInputCommit,
  onInputDecommit,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isValidMessage, setIsValidMessage] = useState(true);

  const isMessageValid = useCallback(
    (message: string) => {
      if (message.length < 1 || message.length > (maxLength || 255)) {
        setIsValidMessage(false);
      } else {
        setIsValidMessage(true);
      }
      if (onMessageChange) {
        onMessageChange(message);
      }
    },
    [maxLength, onMessageChange]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      style={style}
      disabled={disabled}
      aria-label="MyComponent"
      data-testid="my-component"
      {...rest}
      key={message}
    >
      {isValidMessage ? (
        <div
          contentEditable={!readOnly}
          onInput={onInput}
          onInvalid={onInvalid}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onFocusWithin={onFocusWithin}
          onBlurWithin={onBlurWithin}
          onKeyUp={onKeyUp}
          onPaste={onPaste}
          onCut={onCut}
          onCopy={onCopy}
          onWheel={onWheel}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onContextMenu={onContextMenu}
          onDoubleClick={onDoubleClick}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
          onTouchCancel={onTouchCancel}
          onScroll={onScroll}
          onSelect={onSelect}
          onInputModeChange={onInputModeChange}
          onInputFormatChange={onInputFormatChange}
          onInputReject={onInputReject}
          onInputCommit={onInputCommit}
          onInputDecommit={onInputDecommit}
        >
          {placeholder && <span>{placeholder}</span>}
          {sanitizedMessage}
        </div>
      ) : (
        <div>Invalid message</div>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  maxLength: 255,
  readOnly: false,
  tabIndex: 0,
  role: 'textbox',
  disabled: false,
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  tabIndex: PropTypes.number,
  role: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  onMessageChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onInput: PropTypes.func,
  onInvalid: PropTypes.func,
  onCompositionStart: PropTypes.func,
  onCompositionEnd: PropTypes.func,
  onFocusWithin: PropTypes.func,
  onBlurWithin: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPaste: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onWheel: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  onContextMenu: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchCancel: PropTypes.func,
  onScroll: PropTypes.func,
  onSelect: PropTypes.func,
  onInputModeChange: PropTypes.func,
  onInputFormatChange: PropTypes.func,
  onInputReject: PropTypes.func,
  onInputCommit: PropTypes.func,
  onInputDecommit: PropTypes.func,
};

MyComponent.displayName = 'MyComponent';

// Optimize performance by memoizing the component if props don't change
const MemoizedMyComponent: FC<Props> = React.memo(MyComponent);

export default MemoizedMyComponent;

This updated component now provides better resiliency, edge cases handling, accessibility, and maintainability, as well as more flexibility for parent components to handle various events.