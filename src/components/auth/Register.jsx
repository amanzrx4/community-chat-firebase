import { useState, useRef } from 'react';
import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as MaterialLink } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { IconButton, CloseButton, CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { updateProfile } from 'firebase/auth';
import md5 from 'md5';

import {
    FormControl,
    InputLabel,
    FormHelperText,
    Input,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import { firebaseApp } from '../../firebase/config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, child, set } from 'firebase/database';

import SnackBar from './Snackbar';
import { db, auth } from '../../firebase/config';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

// const auth = getAuth();

// export const auth = getAuth(firebaseApp);
// const db = getDatabase(firebaseApp);

function Copyright() {
    return (
        <Typography variant='body2' color='textSecondary' align='center'>
            {'Copyright © '}
            <MaterialLink color='inherit' href='https://material-ui.com/'>
                Your Website
            </MaterialLink>
            {new Date().getFullYear()}
        </Typography>
    );
}

const Register = () => {
    const classes = useStyles();
    const [showBar, setShowBar] = useState(null);

    const initialState = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
        loading: false,
        userRef: ref(db, '/users'),
    };

    const [register, setRegister] = useState(initialState);

    const {
        firstName,
        loading,
        lastName,
        email,
        password,
        emailError,
        passwordError,
        userRef,
    } = register;

    const saveUser = (currentUser) => {
        return set(ref(db, '/users/' + currentUser.uid), {
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
        });
    };

    const handleChange = (e) => {
        setRegister((prevState) => ({
            ...prevState,
            emailError: '',
            passwordError: '',
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(register);

        // setRegister({ [e.target.name]: e.target.value });

        // if (!emailRef.current.value.includes('@', '.')) {
        //     console.log('email should include @');
        //     setEmailError({
        //         error: true,
        //         text: 'Please Enter a valid email bro',
        //     });
        //     return;
        // }
        // let credentials = {
        //     firstname: firstNameRef.current.value,
        //     lastname: lastNameRef.current.value,
        //     email: emailRef.current.value,
        //     password: passwordRef.current.value,
        // };

        // console.log(e.target.emailRef.current.value);

        // setEmailError({
        //     error: null,
        //     text: ' ',
        // });

        if (!email.includes('@') || !email.includes('.')) {
            setRegister({
                ...register,
                emailError: 'Please Enter a valid email',
            });
        }
        if (password.length < 6) {
            setRegister({
                ...register,
                passwordError: 'Password too short',
            });
        } else {
            setRegister({ ...register, loading: true });

            createUserWithEmailAndPassword(auth, email, password)
                .then((createdUser) => {
                    // console.log(createdUser);

                    // createdUser.user
                    //     .updateProfile({
                    //         displayName: firstName,
                    //         photoURL: `https://gravatar.com/avatar/${md5(
                    //             createdUser.user.email
                    //         )}?d=identicon`,
                    //     })
                    //     .then(() => {
                    //         setRegister({ ...register, loading: false });
                    //         console.log(register);
                    //         var displayName = createdUser.user.displayName;
                    //         // "https://example.com/jane-q-user/profile.jpg"
                    //         var photoURL = createdUser.user.photoURL;
                    //         console.log(displayName, photoURL);
                    //     })
                    //     .catch((e) => {
                    //         console.log('error', e);
                    //     });

                    // setShowBar({
                    //     variant: 'error',
                    //     message: `Error: ${createdUser.displayName}`,
                    //     key: `${new Date()}`,
                    // });
                    updateProfile(auth.currentUser, {
                        displayName: firstName,
                        photoURL: `https://gravatar.com/avatar/${md5(
                            createdUser.user.email
                        )}?id=identicon`,
                    })
                        .then(() => {
                            console.log(
                                'everything about current user',
                                auth.currentUser
                            );
                            saveUser(auth.currentUser).then(() =>
                                console.log('saved user')
                            );
                            setRegister({ ...register, loading: false });
                        })
                        .catch((error) => {
                            console.log('error', error);
                            setRegister({ ...register, loading: false });
                        });
                })
                .catch((err) => {
                    // console.log(err.code);
                    // err.message
                    console.log(err.code);
                    if (err.code == 'auth/email-already-in-use') {
                        setShowBar({
                            variant: 'error',
                            message: `Already a registered user, try Signing in`,
                            // key: `${new Date()}`,
                        });
                    }
                    setShowBar({
                        variant: 'error',
                        message: `Error: ${err.code}`,
                        key: `${new Date()}`,
                    });

                    setRegister({ ...register, loading: false });
                    // console.log(err);
                });
        }
    };

    return (
        <>
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Sign up
                    </Typography>

                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    name='firstName'
                                    variant='outlined'
                                    fullWidth
                                    id='firstName'
                                    label='First Name'
                                    autoFocus
                                    autoComplete='on'
                                    onChange={handleChange}
                                    value={firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    name='lastName'
                                    variant='outlined'
                                    fullWidth
                                    id='lastName'
                                    label='Last Name'
                                    autoComplete='on'
                                    onChange={handleChange}
                                    value={lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant='outlined'
                                    required
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    // error={emailError.error}
                                    autoComplete='on'
                                    // helperText={emailError.text}
                                    onChange={handleChange}
                                    value={email}
                                    error={Boolean(emailError)}
                                    helperText={emailError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    variant='outlined'
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    onChange={handleChange}
                                    value={password}
                                    error={Boolean(passwordError)}
                                    helperText={passwordError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value='allowExtraEmails'
                                            color='primary'
                                            required
                                        />
                                    }
                                    label='I want to receive inspiration, marketing promotions and updates via email.'
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            color='primary'
                            className={classes.submit}
                            disabled={loading}
                        >
                            {loading && (
                                <CircularProgress size={20} color='secondary' />
                            )}
                            Sign Up
                        </Button>
                        <Grid container justifyContent='flex-end'>
                            <Grid item>
                                <Link to='/login' variant='body2'>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>

            {showBar && (
                <SnackBar
                    variant={showBar.variant}
                    message={showBar.message}
                    key={showBar.key}
                />
            )}
        </>
    );
};

export default Register;
