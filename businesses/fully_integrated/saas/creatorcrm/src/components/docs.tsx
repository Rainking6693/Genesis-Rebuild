import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Space, Typography } from 'antd';
import { useId, useRef } from '@react-aria/utils';

type Props = {
  message: string;
  ariaLabel?: string;
};

type Ref = HTMLDivElement & {
  focus: () => void;
};

const MessageWithSpace = forwardRef<Ref, Props>(({ message, ariaLabel }, ref) => {
  const id = useId();
  const internalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message) {
      throw new Error('Message is required');
    }
  }, [message]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (internalRef.current) {
        internalRef.current.focus();
      }
    },
  }));

  return (
    <Space direction="vertical" ref={internalRef}>
      <Typography.Paragraph id={id} aria-label={ariaLabel || ''}>
        {message}
      </Typography.Paragraph>
    </Space>
  );
});

// Use MessageWithSpace component instead of FunctionalComponent for better UI consistency
export default MessageWithSpace;

In this updated code, I've added a default value for the `ariaLabel` prop, used a separate `internalRef` to ensure type safety, and added a type for the `ref`. I've also ensured type safety for the `Typography.Paragraph` and `Space` components.