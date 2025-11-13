import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '../contexts/ThemeContext';
import { LocalizationContext } from '../contexts/LocalizationContext';

// Linting configuration (using ESLint and Airbnb style guide)
// eslint-disable-next-line import/no-unassigned-import
import 'babel-plugin-react-docgen/lib/plugin';
import 'babel-plugin-transform-react-constant-elements';
import 'babel-plugin-transform-react-remove-prop-types';
import 'babel-plugin-transform-react-jsx-self-closing';
import 'babel-plugin-transform-react-jsx-source-map';
import 'babel-plugin-transform-react-jsx-throw-error';
import 'babel-plugin-transform-react-jsx-wrap-functions';
import 'babel-plugin-transform-react-jsx-wrap-values';
import 'babel-plugin-transform-react-jsx-xml-jsx';

// Custom hooks
import useIsMountedRef from '../hooks/useIsMountedRef';

// Components
import Button from '../components/Button';
import Text from '../components/Text';

// Utilities
import { getText } from '../utilities/localization';

// Interfaces
interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const Card: FC<Props> = ({
  children,
  title,
  subtitle,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const { theme } = useContext(ThemeContext);
  const { locale } = useContext(LocalizationContext);
  const isMountedRef = useIsMountedRef();

  const [localizedTitle, setLocalizedTitle] = useState(title);
  const [localizedSubtitle, setLocalizedSubtitle] = useState(subtitle);

  useEffect(() => {
    if (isMountedRef.current) {
      setLocalizedTitle(getText(locale, 'cardTitle', title));
      setLocalizedSubtitle(getText(locale, 'cardSubtitle', subtitle));
    }
  }, [locale]);

  return (
    <div className={`card ${theme}`}>
      <div className="card-header">
        <Text as="h3" variant="heading" className="card-title">
          {localizedTitle}
        </Text>
        {subtitle && (
          <Text as="p" variant="body" className="card-subtitle">
            {localizedSubtitle}
          </Text>
        )}
      </div>
      <div className="card-body">{children}</div>
      <div className="card-footer">
        {onPrimaryAction && (
          <Button onClick={onPrimaryAction} variant="primary">
            {primaryActionLabel}
          </Button>
        )}
        {onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="secondary">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  primaryActionLabel: PropTypes.string.isRequired,
  secondaryActionLabel: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  onSecondaryAction: PropTypes.func,
};

Card.defaultProps = {
  subtitle: undefined,
  onPrimaryAction: undefined,
  onSecondaryAction: undefined,
};

export default Card;

import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '../contexts/ThemeContext';
import { LocalizationContext } from '../contexts/LocalizationContext';

// Linting configuration (using ESLint and Airbnb style guide)
// eslint-disable-next-line import/no-unassigned-import
import 'babel-plugin-react-docgen/lib/plugin';
import 'babel-plugin-transform-react-constant-elements';
import 'babel-plugin-transform-react-remove-prop-types';
import 'babel-plugin-transform-react-jsx-self-closing';
import 'babel-plugin-transform-react-jsx-source-map';
import 'babel-plugin-transform-react-jsx-throw-error';
import 'babel-plugin-transform-react-jsx-wrap-functions';
import 'babel-plugin-transform-react-jsx-wrap-values';
import 'babel-plugin-transform-react-jsx-xml-jsx';

// Custom hooks
import useIsMountedRef from '../hooks/useIsMountedRef';

// Components
import Button from '../components/Button';
import Text from '../components/Text';

// Utilities
import { getText } from '../utilities/localization';

// Interfaces
interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const Card: FC<Props> = ({
  children,
  title,
  subtitle,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const { theme } = useContext(ThemeContext);
  const { locale } = useContext(LocalizationContext);
  const isMountedRef = useIsMountedRef();

  const [localizedTitle, setLocalizedTitle] = useState(title);
  const [localizedSubtitle, setLocalizedSubtitle] = useState(subtitle);

  useEffect(() => {
    if (isMountedRef.current) {
      setLocalizedTitle(getText(locale, 'cardTitle', title));
      setLocalizedSubtitle(getText(locale, 'cardSubtitle', subtitle));
    }
  }, [locale]);

  return (
    <div className={`card ${theme}`}>
      <div className="card-header">
        <Text as="h3" variant="heading" className="card-title">
          {localizedTitle}
        </Text>
        {subtitle && (
          <Text as="p" variant="body" className="card-subtitle">
            {localizedSubtitle}
          </Text>
        )}
      </div>
      <div className="card-body">{children}</div>
      <div className="card-footer">
        {onPrimaryAction && (
          <Button onClick={onPrimaryAction} variant="primary">
            {primaryActionLabel}
          </Button>
        )}
        {onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="secondary">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  primaryActionLabel: PropTypes.string.isRequired,
  secondaryActionLabel: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  onSecondaryAction: PropTypes.func,
};

Card.defaultProps = {
  subtitle: undefined,
  onPrimaryAction: undefined,
  onSecondaryAction: undefined,
};

export default Card;