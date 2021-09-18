import React, { useState } from 'react';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent as SnackContent } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = (theme) => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function SnackbarContent(props) {
    const { className, classes, message, onClose, variant, ...other } = props;

    const Icon = variantIcon[variant];

    return (
        <SnackContent
            className={classNames(classes[variant], className)}
            aria-describedby='client-snackbar'
            message={
                <span id='client-snackbar' className={classes.message}>
                    <Icon
                        className={classNames(
                            classes.icon,
                            classes.iconVariant
                        )}
                    />
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key='close'
                    aria-label='Close'
                    color='inherit'
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

const SnackbarWrapper = withStyles(styles1)(SnackbarContent);

const styles2 = (theme) => ({
    margin: {
        margin: theme.spacing.unit,
    },
    trans: {
        transform: 'translate(0% -50%)',
    },
});

const CustomizedSnackbar = ({ onClose, classes, variant, message }) => {
    
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };
    // handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }

    //     this.setState({ open: false });
    // const { classes } = props;
    // };
    return (
        <>
            <Snackbar
                // styles={{
                //     transform: 'translate(50% -50%)',
                // }}
                // style={{ height: '100%' }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                // TransitionComponent={SlideTransition}
                // key={new Date()}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <SnackbarWrapper
                    onClose={handleClose}
                    variant={variant}
                    message={message}
                />
            </Snackbar>

            {/* <SnackbarContentWrapper
                variant='error'
                className={classes.margin}
                message='This is an error message!'
            />
            <SnackbarContentWrapper
                variant='warning'
                className={classes.margin}
                message='This is a warning message!'
            />
            <SnackbarContentWrapper
                variant='info'
                className={classes.margin}
                message='This is an information message!'
            />
            <SnackbarContentWrapper
                variant='success'
                className={classes.margin}
                message='This is a success message!'
            /> */}
        </>
    );
};

export default withStyles(styles2)(CustomizedSnackbar);
