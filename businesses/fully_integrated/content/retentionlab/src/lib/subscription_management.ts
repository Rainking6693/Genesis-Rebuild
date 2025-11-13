import React from 'react';
import { useTheme } from './ThemeContext';
import { makeStyles, createStyles } from '@material-ui/core/styles';

type Theme = ReturnType<typeof useTheme>;

type MessageComponentProps = {
  variant: 'SubscriptionManagement' | 'RetentionLab';
  message: string;
  colorScheme?: 'light' | 'dark';
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '1.5',
      marginBottom: theme.spacing(2),
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.125rem',
      },
      '&:focus': {
        outline: 'none',
      },
    },
  })
);

const MessageComponent: React.FC<MessageComponentProps> = ({ variant, message, colorScheme }) => {
  const classes = useStyles({ colorScheme });
  const { mode } = useTheme<Theme>();

  if (!message) {
    return null;
  }

  if (variant !== 'SubscriptionManagement' && variant !== 'RetentionLab') {
    throw new Error('Invalid variant value');
  }

  return <div className={classes.message} key={message} aria-label={`Message from ${variant}`}>{message}</div>;
};

export const SubscriptionManagementMessage = (props: Omit<MessageComponentProps, 'variant'>) => {
  return <MessageComponent {...props} variant="SubscriptionManagement" />;
};

export const RetentionLabMessage = (props: Omit<MessageComponentProps, 'variant'>) => {
  return <MessageComponent {...props} variant="RetentionLab" />;
};

This updated code addresses the requested improvements and adds additional checks for edge cases and accessibility.