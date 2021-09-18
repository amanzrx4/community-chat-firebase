import { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
import {
    Dialog,
    Typography,
    TextField,
    Button,
    InputBase,
    Box,
    CircularProgress,
    // CircularProgressWithLabel
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
import { PhotoCamera } from '@material-ui/icons';

import {
    getStorage,
    uploadBytes,
    ref as storageRefInit,
    uploadBytesResumable,
    getDownloadURL,
} from '@firebase/storage';

import { storageFire } from '../../firebase/config';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
    root2: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },

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

const UploadModal = ({
    addFile,
    closeModal,
    open,
    loading,
    setLoading,
    progress,
}) => {
    const classes = useStyles();

    const [fileState, setFileState] = useState(null);

    const initialState = {
        file: null,
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
        imageUrl: null,
    };

    const [fileUp, setFileUp] = useState(initialState);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFileUp((prev) => ({
                ...prev,
                file: file,
            }));
            setFileState(file);
        }
    };

    const onSubmit = (e) => {
        setLoading(true);

        e.preventDefault();
        addFile(fileState);

        // setFileUp((prev) => ({
        //     ...prev,
        //     file: null,
        // }));
    };

    // const newSort = getStorage(firebaseApp);
    // const addFile = () => {
    //     const { file } = fileUp;
    //     if (file) {
    //         console.log('dont touch', fileUp.file);

    //         // const pathToUpload = currentChannel.id;
    //         const filePath = `chat/public/${uuidv4()}.jpg`;

    //         const storageRef = storageRefInit(storageFire, filePath);

    //         const uploadTask = uploadBytesResumable(storageRef, file);

    //         uploadTask.on(
    //             'state_changed',
    //             (snapshot) => {
    //                 const progress =
    //                     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                 console.log('Upload is ' + progress + '% done');
    //             },
    //             (error) => {
    //                 console.log(error);
    //             },
    //             () => {
    //                 getDownloadURL(uploadTask.snapshot.ref).then(
    //                     (downloadURL) => {
    //                         console.log('File available at', downloadURL);
    //                         setFileUp((prev) => ({
    //                             ...prev,
    //                             imageUrl: downloadURL,
    //                         }));
    //                     }
    //                 );
    //             }
    //         );
    //     }
    // };

    // const messageObj = {
    //     content: messageInput,
    //     timeStamp: serverTimestamp(),
    //     user: {
    //         name: currentUser.displayName,
    //         id: currentUser.uid,
    //         avatar: currentUser.photoURL,
    //     },
    //     ...(fileUp.imageUrl && { imageUrl: fileUp.imageUrl }),
    // };

    // const messageSent = () => {
    //     push(ref(db, '/messages/' + currentChannel.id), { ...messageObj }).then(
    //         () => {
    //             setInputState((prev) => ({
    //                 ...prev,
    //                 messageInput: '',
    //                 loading: false,
    //                 error: '',
    //             }));
    //             setFileUp((prev) => ({
    //                 ...prev,
    //                 imageUrl: null,
    //             }));
    //         }
    //     );
    // };

    // const handleChange = (e) => {
    //     setInputState((prevState) => ({
    //         ...prevState,
    //         aboutError: '',
    //         [e.target.name]: e.target.value,
    //     }));
    // };

    // const channelAdded = () => {
    //     const uniqueKeyRef = push(ref(db, '/channels'));

    //     set(uniqueKeyRef, {
    //         id: uniqueKeyRef.key,
    //         name: inputState.name,
    //         about: inputState.about,
    //         createdBy: {
    //             avatar: currentUser.photoURL,
    //             name: currentUser.displayName,
    //         },
    //         createdAt: serverTimestamp(),
    //     })
    //         .then(() => console.log('channel added to firebase then'))
    //         .catch((e) => console.log('promise error', e));
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log('State', inputState);
    //     console.log('channel added');
    //     console.log(inputState);
    //     setInputState({ ...initialState });
    //     console.log(inputState);
    //     setOpen(false);
    //     channelAdded();
    // };

    return (
        <Dialog
            onClose={closeModal}
            fullWidth
            aria-labelledby='customized-dialog-title'
            open={open}
            className={classes.dialog}
        >
            <form onSubmit={onSubmit}>
                <DialogTitle onClose={closeModal} id='customized-dialog-title'>
                    # Upload Media
                </DialogTitle>
                <DialogContent dividers>
                    {/* <FormControl className={classes.margin}>
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
                    </FormControl> */}
                    {/* <FormControl className={classes.margin}>
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
                            className={
                                inputState.aboutError ? classes.span : null
                            }
                            component='span'
                            display='block'
                        >
                            {inputState.aboutError}
                        </Box>
                    </FormControl> */}

                    <div className={classes.root2}>
                        {!loading && (
                            <input
                                accept='image/*'
                                id='contained-button-file'
                                multiple
                                type='file'
                                onChange={handleFileChange}
                            />
                        )}

                        {loading && (
                            <CircularProgressWithLabel
                                size={80}
                                value={progress}
                            />
                        )}
                        {/* <label htmlFor='contained-button-file'>
                            <Button
                                variant='contained'
                                color='primary'
                                component='span'
                            >
                                Upload
                            </Button>
                        </label> */}
                    </div>
                </DialogContent>
                <DialogActions style={{ padding: 10 }}>
                    <Button
                        style={{ borderRadius: 6 }}
                        variant='contained'
                        color='secondary'
                        disableElevation
                        onClick={closeModal}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        style={{ borderRadius: 6 }}
                        variant='contained'
                        color='primary'
                        disableElevation
                        type='submit'
                        disabled={loading}
                    >
                        Add
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UploadModal;
// export default ChannelModal;

function CircularProgressWithLabel(props) {
    return (
        <Box
            position='relative'
            style={{ margin: 'auto', width: '100%' }}
            display='inline-flex'
        >
            <CircularProgress
                style={{ margin: 'auto' }}
                variant='determinate'
                {...props}
            />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position='absolute'
                display='flex'
                alignItems='center'
                justifyContent='center'
            >
                <Typography
                    variant='caption'
                    component='div'
                    color='textSecondary'
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}
{
    /*  */
}
