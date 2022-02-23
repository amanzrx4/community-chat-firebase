import { useState } from 'react';
import React from 'react';

import {
  Avatar,
  Box,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Link as MaterialLink,
  Grid,
  CircularProgress,
  Button,
  Container,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { updateProfile } from 'firebase/auth';

import { Link } from 'react-router-dom';

import { firebaseApp } from '../../firebase/config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
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

const Login = () => {
  const classes = useStyles();
  const [showBar, setShowBar] = useState(null);

  const initialState = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    loading: false,
  };

  const [login, setLogin] = useState(initialState);

  const { loading, email, password, emailError, passwordError } = login;

  const handleChange = (e) => {
    setLogin((prevState) => ({
      ...prevState,
      emailError: '',
      passwordError: '',
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log(login);

    if (!email.includes('@') || !email.includes('.')) {
      setLogin({
        ...login,
        emailError: 'Please Enter a valid email',
      });
    }
    if (password.length < 6) {
      setLogin({
        ...login,
        passwordError: 'Password too short',
      });
    } else {
      setLogin({ ...login, loading: true });
      signInWithEmailAndPassword(auth, email, password)
        .then((signedInUser) => {
          setLogin({ ...login, loading: false });
          // console.log(signedInUser);
        })
        .catch((e) => {
          // console.log('error', e);
          setLogin({ ...login, loading: false });
        });

      // createUserWithEmailAndPassword(auth, email, password)
      //     .then((createdUser) => {
      //         updateProfile(auth.currentUser, {
      //             displayName: 'firstName',
      //             photoURL: `https://gravatar.com/avatar/${createdUser.user.email}?d=identicon`,
      //         })
      //             .then(() => {
      //                 console.log(
      //                     'everything about current user',
      //                     auth.currentUser
      //                 );
      //                 saveUser(auth.currentUser).then(() =>
      //                     console.log('saved user')
      //                 );
      //                 setLogin({ ...Login, loading: false });
      //             })
      //             .catch((error) => {
      //                 console.log('error', error);
      //                 setLogin({ ...Login, loading: false });
      //             });
      //     })
      //     .catch((err) => {
      //         console.log(err.code);
      //         if (err.code == 'auth/email-already-in-use') {
      //             setShowBar({
      //                 variant: 'error',
      //                 message: `Already a Logined user, try Signing in`,
      //             });
      //         }
      //         setShowBar({
      //             variant: 'error',
      //             message: `Error: ${err.code}`,
      //             key: `${new Date()}`,
      //         });
      //         setLogin({ ...Login, loading: false });
      //     });
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
            Sign In
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              autoFocus
              variant='outlined'
              required
              fullWidth
              margin='normal'
              id='email'
              label='Email Address'
              name='email'
              autoComplete='on'
              onChange={handleChange}
              value={email}
              error={Boolean(emailError)}
              helperText={emailError}
            />
            <TextField
              required
              variant='outlined'
              fullWidth
              name='password'
              label='Password'
              type='password'
              margin='normal'
              id='password'
              onChange={handleChange}
              value={password}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' required />}
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={loading}
            >
              {loading && <CircularProgress size={20} color='secondary' />}
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to='/register' variant='body2'>
                  {"Don't have an account? Sign Up"}
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

export default Login;
