import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import React from 'react';

import {
  Dialog,
  Typography,
  TextField,
  Button,
  InputBase,
  Box,
} from '@material-ui/core';
import { FormControl, InputLabel, Modal } from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles, alpha } from '@material-ui/core';

import {
  getDatabase,
  ref,
  child,
  push,
  set,
  serverTimestamp,
  onChildChanged,
  query,
  onChildAdded,
} from 'firebase/database';

import { db, auth } from '../../firebase/config';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
    width: '95%',
  },
  dialog: {
    minWidth: '200px',
  },
  span: {
    color: 'red',
    opacity: ' 0.54',
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 16,
    animation: `$myEffect 300ms ${theme.transitions.easing.easeInOut}`,
  },

  '@keyframes myEffect': {
    '0%': {
      transform: 'translateX(0)',
    },
    '33%': {
      transform: 'translateX(-3%)',
    },
    '66%': {
      transform: 'translateX(+3%)',
    },
    '100%': {
      transform: 'translateX(0)',
    },
  },
}));

const ValidationTextField = withStyles({
  root: {
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      padding: '4px !important', // override inline-style
    },
  },
})(TextField);

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h5' color='primary'>
        <strong>{children}</strong>
      </Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ChannelModal = ({ open, setOpen, currentUser, setChannels }) => {
  const classes = useStyles();

  let initialState = {
    name: '',
    about: '',
    aboutError: '',
    channels: '',
  };

  const [inputState, setInputState] = useState(initialState);

  const handleChange = (e) => {
    setInputState((prevState) => ({
      ...prevState,
      aboutError: '',
      [e.target.name]: e.target.value,
    }));
  };

  // const channelSnap = () => {
  //     onChildChanged()
  // }

  // useEffect(() => {
  //     const childAdded = onChildChanged(
  //         query(ref(db, '/channels')),
  //         (snap) => {
  //             //    console.log("snap", snap)
  //             channelsArray.push(snap.val());
  //             //    console.log(channels)
  //             setInputState((...prevState) => ({
  //                 ...prevState,
  //                 channels: channelsArray,
  //             }));
  //         }
  //     );

  //     return () => {
  //         childAdded();
  //     };
  // }, []);

  // useEffect(() => {
  //     let channelsArray = [];
  //     const childAdded = onChildAdded(query(ref(db, '/channels')), (snap) => {
  //         channelsArray.push(snap.val());
  //         setChannel([...channelsArray]);
  //         console.log('channel state', channelsArray);
  //     });

  //     return () => {
  //         childAdded();
  //     };
  // }, []);

  const channelAdded = () => {
    const uniqueKeyRef = push(ref(db, '/channels'));

    set(uniqueKeyRef, {
      id: uniqueKeyRef.key,
      name: inputState.name,
      about: inputState.about,
      createdBy: {
        avatar: currentUser.photoURL,
        name: currentUser.displayName,
      },
      createdAt: serverTimestamp(),
    })
      .then(() => console.log('channel added to firebase then'))
      .catch((e) => console.log('promise error', e));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('State', inputState);
    // if (inputState.about.length < 15) {
    //     setInputState({
    //         ...inputState,
    //         aboutError: 'Atleast add 15 characters in about section',
    //     });
    //     console.log(inputState);
    //     return;
    // } else {
    console.log('channel added');
    console.log(inputState);
    setInputState({ ...initialState });
    console.log(inputState);
    setOpen(false);
    channelAdded();
    // }
  };

  return (
    <Dialog
      onClose={() => setOpen((prev) => !prev)}
      fullWidth
      aria-labelledby='customized-dialog-title'
      open={open}
      className={classes.dialog}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          onClose={() => setOpen((prev) => !prev)}
          id='customized-dialog-title'
        >
          # Add a Channel
        </DialogTitle>
        <DialogContent dividers>
          <FormControl className={classes.margin}>
            <InputLabel shrink htmlFor='bootstrap-input'>
              Name
            </InputLabel>
            <BootstrapInput
              error={true}
              required
              autoComplete='on'
              value={inputState.name}
              onChange={handleChange}
              name='name'
              placeholder='Name of the Channel'
              // defaultValue='react-bootstrap'
              id='bootstrap-input'
            />
          </FormControl>
          <FormControl className={classes.margin}>
            <InputLabel shrink htmlFor='bootstrap-input2'>
              About
            </InputLabel>
            <BootstrapInput
              autoComplete='on'
              error={Boolean(inputState.aboutError)}
              required
              helperText='hi working now'
              value={inputState.about}
              onChange={handleChange}
              name='about'
              placeholder='About the Channel'
              multiline
              rows={8}
              // defaultValue='react-bootstrap'
              id='bootstrap-input2'
            />

            <Box
              style={{
                marginTop: -6,
              }}
              className={inputState.aboutError ? classes.span : null}
              component='span'
              display='block'
            >
              {inputState.aboutError}
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions style={{ padding: 10 }}>
          <Button
            style={{ borderRadius: 6 }}
            variant='contained'
            color='secondary'
            disableElevation
            onClick={() => setOpen((prev) => !prev)}
          >
            Cancel
          </Button>

          <Button
            style={{ borderRadius: 6 }}
            variant='contained'
            color='primary'
            disableElevation
            type='submit'
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
})(TextField);

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '100%',
    padding: '10px 14px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(ChannelModal);
// export default ChannelModal;
