import { Paper, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    paper: {
        textAlign: 'center',
        display: 'flex',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        height: '50%',
        margin: 'auto',
        width: '80%',
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    },
}));

const NotFound = ({ message }) => {
    const classes = useStyles();
    return (
        <Box className={classes.paper}>
            <Typography variant='h5'>
                <i>Sorry, we couldn't find any messages with "</i>
                <strong>{message}</strong> " :(
            </Typography>
        </Box>
    );
};

export default NotFound;
