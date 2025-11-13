import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

type AriaLabelType = string;

interface Props {
  subject?: string; // Add default value and make it optional
  message: string;
}

const MyComponent: FC<Props> = ({ subject = 'Newsletter', message }) => {
  return (
    <div>
      <h2>{subject}</h2>
      <div>{message}</div>
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Welcome to SkillStack AI newsletter!',
};

MyComponent.propTypes = {
  subject: PropTypes.string,
  message: PropTypes.string.isRequired,
};

type MemoizedFC<P> = typeof memo extends ((C: FC<infer U>) => FC<U>) ? (C: FC<P>) => FC<P> : never;

const MemoizedMyComponent = memo(MyComponent) as MemoizedFC<Props>;

const AccessibleMyComponent: FC<Props> = ({ subject, message }: Props) => {
  return (
    <div aria-label="Newsletter component">
      <MemoizedMyComponent subject={subject} message={message} />
    </div>
  );
};

export default AccessibleMyComponent;

This updated code ensures better type safety, handles edge cases, and improves the maintainability of the code.