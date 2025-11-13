import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useId } from '@reach/auto-id';
import { classNames } from './utils';

interface Props {
  message: string;
}

const MyDashboardUIComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const componentRef = useRef<HTMLDivElement>(null);
  const memoizedComponent = useMemo(() => (
    <div id={id} ref={componentRef} data-testid="mindflow-message" className="mindflow-message" role="alert" aria-live="polite">
      <div id={`${id}-fallback`} className={classNames('mindflowMessage', 'fallback')}>
        {message}
      </div>
      <div id={`${id}-styles`} dangerouslySetInnerHTML={{ __html: styles.toString() }} />
    </div>
  ), [id, message]);

  useEffect(() => {
    if (componentRef.current) {
      const styles = document.querySelector(`#${id}-styles`);
      if (styles) {
        styles.remove();
        const stylesNodeList = document.querySelectorAll(`#${id} .mindflowMessage`);
        if (stylesNodeList.length > 0) {
          stylesNodeList.forEach((style) => {
            style.classList.add(...document.querySelectorAll('.mindflowMessage').map((c) => c.className));
          });
        }
      }
    }

    return () => {
      const styles = document.querySelector(`#${id}-styles`);
      if (styles) {
        styles.remove();
      }
    };
  }, [id]);

  return memoizedComponent;
};

// Add a unique identifier for the component for better tracking and maintenance
MyDashboardUIComponent.displayName = 'MyDashboardUIComponent';

// Import necessary styles for better visual consistency
import styles from './MyDashboardUIComponent.module.css';

// Use the imported styles for better visual consistency
const MyDashboardUIComponentWithStyles = (props: Props) => (
  <div id={`${props.id}-container`} className={classNames('mindflowMessageContainer')}>
    <div id={props.id} aria-labelledby={`${props.id}-label`} aria-describedby={`${props.id}-description`} tabIndex={0}>
      {props.message}
    </div>
    <div id={`${props.id}-label`}>{props.message}</div>
    <div id={`${props.id}-description`}>Dashboard message</div>
  </div>
);

// Export the styled component for usage
export default MyDashboardUIComponentWithStyles;

// Utils for classNames and fallback styles
import React from 'react';

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const fallbackStyles = {
  '.fallback': {
    margin: '1em 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '0.5em',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.id = 'fallback-styles';
  style.data-autoid = 'fallback-styles';
  style.textContent = Object.entries(fallbackStyles).map(([selector, styles]) => `${selector} { ${Object.entries(styles).map(([property, value]) => `${property}: ${value};`).join(' ')} }`).join('\n');
  document.head.appendChild(style);
});

This version includes the changes mentioned above, and it also adds a container for the message, labels, and descriptions for better accessibility. The styles are now also removed when the component unmounts.