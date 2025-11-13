import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Box } from '@material-ui/core';

interface DashboardUIProps {
  title: string;
  children: ReactNode;
  maxWidth?: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(6),
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

const DashboardUI: React.FC<DashboardUIProps> = ({ title, children, maxWidth }) => {
  const classes = useStyles();
  const [isMobile, setIsMobile] = useState(false);
  const matches = useMediaQuery(theme => theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsMobile(matches);
  }, [matches]);

  return (
    <Box className={classes.root} maxWidth={maxWidth}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

DashboardUI.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.number,
};

DashboardUI.defaultProps = {
  maxWidth: null,
};

export default DashboardUI;

import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Box } from '@material-ui/core';

interface DashboardUIProps {
  title: string;
  children: ReactNode;
  maxWidth?: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(6),
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

const DashboardUI: React.FC<DashboardUIProps> = ({ title, children, maxWidth }) => {
  const classes = useStyles();
  const [isMobile, setIsMobile] = useState(false);
  const matches = useMediaQuery(theme => theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsMobile(matches);
  }, [matches]);

  return (
    <Box className={classes.root} maxWidth={maxWidth}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

DashboardUI.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.number,
};

DashboardUI.defaultProps = {
  maxWidth: null,
};

export default DashboardUI;