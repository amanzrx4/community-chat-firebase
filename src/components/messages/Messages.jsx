import { AccountCircle, AddBoxRounded } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import { Search } from '@material-ui/icons';
import { db, firebaseApp, storageFire } from '../../firebase/config';
import NotFound from './NotFound';
import MetaPanel from '../metaPanel/MetaPenel';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';

import {
  Button,
  ButtonGroup,
  Grid,
  TextField,
  InputAdornment,
  MuiFormHelperText,
  CircularProgress,
  Input,
} from '@material-ui/core';

import Mess from './Mess';
import { snapshotToArray } from '../../utils/snapshotArray';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
// import { CircularProgress } from '@material-ui/core';
import {
  getDatabase,
  ref as dbRef,
  child,
  push,
  set,
  serverTimestamp,
  onChildChanged,
  query,
  onChildAdded,
  getChildrenCount,
  onValue,
} from 'firebase/database';

import { updateCurrentUser } from '@firebase/auth';
import UploadModal from './UploadModal';
import {
  getStorage,
  uploadBytes,
  ref as storageRefInit,
  uploadBytesResumable,
  getDownloadURL,
} from '@firebase/storage';
import Channel from '../sidePanel/Channel';
import ACTIONS from '../../actions/actionTypes';
const useStyles = makeStyles((theme) => ({
  input: {
    padding: '14px 8px',
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  adornedStart: {
    paddingLeft: 0,
  },
  uploadInput: {
    display: 'none',
  },
  searchFlex: {
    display: 'flex',
    direction: 'row',
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const Messages = ({ currentChannel, currentUser, isPrivateChannel }) => {
  const [open, setOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const messagesLoading = useSelector((state) => state.messagesLoading);
  const dispatch = useDispatch();
  // console.log('messages loading', typeof messagesLoading);

  const closeModal = () => {
    setOpen(false);
    setLoadingModal(false);
    setProgress(0);
  };

  const openModal = () => {
    setOpen(true);
  };

  const classes = useStyles();
  let initialState = {
    messageInput: '',
    loading: false,
    error: '',
    messages: [],
    searchTerm: '',
    // messagesLoading: true,
    file: null,
    privateChannel: isPrivateChannel,
    numUniqueUsers: null,
    searchResultsState: null,
    privateMessagesRef: 'privateMessages',
    messagesRef: 'messages',
  };

  const [fileUrl, setFileUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [searchLoading2, setSearchLoading2] = useState(false);
  const [activeDm, setActiveDm] = useState('');

  const [inputState, setInputState] = useState(initialState);
  const {
    messageInput,
    loading,
    error,
    messages,
    // messagesLoading,
    numUniqueUsers,
    searchTerm,
    searchLoading,
    searchResultsState,
    privateChannel,
    privateMessagesRef,
    messagesRef,
  } = inputState;

  useEffect(() => {
    if (!currentChannel) {
      // console.log('return bcz null');
      return;
    }
    let messagesArray = [];
    const newRefAll = getMessagesRef();

    // console.log('newred', newRefAll);
    // console.log('running');
    // setInputState((prev) => ({ ...prev, messages: '' }));

    const childAdded = onChildAdded(
      dbRef(db, newRefAll + '/' + currentChannel.id),
      (snapshot) => {
        let messagesArray2 = [];
        if (!snapshot.exists()) {
          setInputState({ ...inputState, messages: initialState.messages });
          dispatch({ type: ACTIONS.MESSAGES_LOADING_DONE });
          return countUniqueUsers(messagesArray);
        }

        // const arrayOfSnap = snapshotToArray(snapshot.val());
        messagesArray.push(snapshot.val());
        // console.log('filhaal messagfe', snapshot.val());
        setInputState((prev) => ({ ...prev, messages: messagesArray }));
        dispatch({ type: ACTIONS.MESSAGES_LOADING_DONE });
        countUniqueUsers(messagesArray);
      },
      (error) => {
        // console.log('error hai', error);
      }
    );

    return () => {
      childAdded();
    };
  }, [currentChannel]);

  const handleChange = (event) => {
    setInputState((prev) => ({
      ...prev,
      error: '',
      [event.target.name]: event.target.value,
    }));
  };

  const pathFind = () => {
    if (isPrivateChannel) {
      return `chat/private-${currentChannel.id}`;
    } else {
      return 'chat/public';
    }
  };

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  const addFile = (fileState) => {
    if (fileState) {
      // console.log('dont touch this file actual', fileState);
      const filePath = `${pathFind()}/${uuidv4()}.jpg`;

      const storageRef = storageRefInit(storageFire, filePath);

      const uploadTask = uploadBytesResumable(storageRef, fileState);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          // console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            sendMessage(downloadURL);
          });
        }
      );
    }
  };

  const createMessage = (downloadURLImage) => {
    const messageObj = {
      timeStamp: serverTimestamp(),
      user: {
        name: currentUser.displayName,
        id: currentUser.uid,
        avatar: currentUser.photoURL,
      },
    };
    if (downloadURLImage !== null) {
      messageObj['image'] = downloadURLImage;
    } else {
      messageObj['content'] = messageInput;
    }

    return messageObj;
  };

  const messageSent = (downloadURLImage) => {
    const messageObject = createMessage(downloadURLImage);
    const refFindNew = getMessagesRef();

    push(
      dbRef(db, refFindNew + '/' + currentChannel.id),
      // dbRef(db, '/messages/' + currentChannel.id),
      messageObject
    ).then(() => {
      setInputState((prev) => ({
        ...prev,
        messageInput: '',
        loading: false,
        error: '',
      }));
      closeModal();
    });
  };

  const sendMessage = (downloadURLImage = null) => {
    // console.log('download url reached', downloadURLImage);
    // console.log('download url reached 2', downloadURLImage);

    if (downloadURLImage || messageInput) {
      // console.log('yup doing', downloadURLImage);
      setInputState((prev) => ({
        ...prev,
        loading: true,
      }));
      messageSent(downloadURLImage);
    } else {
      // console.log('not doing bro');
      setInputState((prev) => ({
        ...prev,
        error: 'please enter a message',
      }));
    }
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const regex = new RegExp(searchTerm, 'gi');
  const handleSearchChange = (event) => {
    setSearchLoading2(true);

    setInputState((prev) => ({
      ...prev,
      searchTerm: event.target.value,
    }));

    if (searchTerm) {
      const searchResults = messages.reduce((acc, message) => {
        if (
          (message.content && message.content.match(regex)) ||
          message.user.name.match(regex)
        ) {
          acc.push(message);
        }
        return acc;
      }, []);
      setInputState((prev) => ({
        ...prev,
        searchResultsState: searchResults,
      }));

      setTimeout(() => setSearchLoading2(false), 1000);
    }
  };

  const countUniqueUsers = (someRandomArray) => {
    if (someRandomArray.length == 0) {
      // const numUniqueUsersIn = `${0} users`;
      return setInputState((prev) => ({
        ...prev,
        numUniqueUsers: 0,
      }));
    }
    const uniqueUsers = someRandomArray.reduce((acc, someRandomArrayitem) => {
      if (!acc.includes(someRandomArrayitem.user?.id)) {
        acc.push(someRandomArrayitem.user?.id);
      }
      return acc;
    }, []);
    const numUniqueUsersIn = `${uniqueUsers.length} user${
      uniqueUsers.length > 1 ? 's' : ''
    }`;
    setInputState((prev) => ({
      ...prev,
      numUniqueUsers: numUniqueUsersIn,
    }));
  };

  return (
    <>
      <Grid
        xs={9}
        container
        style={{ backgroundColor: '#4c3c4c', maxHeight: '100vh' }}
      >
        <Grid
          xs={12}
          item
          container
          style={{
            backgroundColor: 'red',
            height: '83%',
            width: '100%',
          }}
        >
          <Grid
            xs={8}
            container
            item
            style={{
              backgroundColor: 'blue',
              height: '100%',
              width: '100%',
            }}
          >
            <Grid
              xs={12}
              item
              style={{
                backgroundColor: 'pink',
                height: '15%',
              }}
            >
              <div className={classes.searchFlex}>
                <div style={{ margin: '20px' }}>
                  <h1>
                    {currentChannel &&
                      (isPrivateChannel
                        ? `@${currentChannel.name}`
                        : `#${currentChannel.name}`)}

                    {/* {currentChannel ? privateChannel ? '@'
                                        : '#'
                                        currentChannel.name */}
                  </h1>
                  <h3>
                    {/* #unique users{' '} */}
                    {numUniqueUsers == null
                      ? null
                      : numUniqueUsers == 0
                      ? 'no users'
                      : numUniqueUsers}
                  </h3>
                </div>

                <TextField
                  style={{ margin: '20px' }}
                  onChange={handleSearchChange}
                  id='standard-basic'
                  label='search messages'
                  variant='standard'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search />
                      </InputAdornment>
                    ),
                    classes: {
                      adornedStart: classes.adornedStart,
                    },
                  }}
                />
              </div>
            </Grid>

            <Grid
              xs={12}
              item
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: '85%',
                // overflow: 'auto',
                overflowY: 'scroll',
                maxHeight: '100%',
              }}
            >
              <div>
                {searchTerm &&
                  (searchLoading2 ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '70%',
                      }}
                    >
                      <CircularProgress size={60} />
                    </div>
                  ) : searchResultsState && searchResultsState.length == 0 ? (
                    <NotFound message={searchTerm} />
                  ) : (
                    searchResultsState.map((message) => (
                      <Mess message={message} key={message.id} />
                    ))
                  ))}
                {messagesLoading ? (
                  <CircularProgress size={60} />
                ) : (
                  messages.length > 0 &&
                  messages.map((message) => (
                    <Mess message={message} key={message.id} />
                  ))
                )}
                {!messagesLoading && !messages.length > 0 && (
                  <Mess message={{ hihi: 'nothing to show' }} />
                )}

                {/* {messages.length = 0 &&
                              <Mess message="nothing to show" />
                              } */}
              </div>
            </Grid>
          </Grid>
          <Grid xs={4} item style={{ backgroundColor: 'white' }}>
            <MetaPanel
              key={currentChannel && currentChannel.id}
              isPrivateChannel={isPrivateChannel}
              currentChannel={currentChannel}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          // alignContent='space-between'
          alignItems='stretch'
          style={{
            backgroundColor: 'white',
            height: '17%',
            padding: 0,
            // <form style={{ width: '100%' }}>
            width: '100%',
          }}
        >
          <form onSubmit={onFormSubmit} style={{ width: '100%' }}>
            {/* <Grid item xs={12}> */}
            <Grid item xs={12}>
              <TextField
                name='messageInput'
                // error={Bool/ean(error)}
                // helperText={error}
                value={messageInput}
                onChange={handleChange}
                placeholder='Write your message'
                inputProps={{
                  className: classes.input,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      style={{
                        padding: 0,
                        margin: 0,
                        paddingLeft: 0,
                        textAlign: 'center',
                      }}
                    >
                      <AddBoxRounded
                        style={{
                          padding: '10px',
                          textAlign: 'center',
                        }}
                        fontSize='large'
                      />
                    </InputAdornment>
                  ),
                  classes: {
                    adornedStart: classes.adornedStart,
                  },
                  disableUnderline: true,
                }}
                style={{ width: '100%', borderBottom: 0 }}
                id='outlined-basic'
                variant='filled'
              />
              <div
                style={{
                  color: 'red',
                  fontSize: 14,
                  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                  marginBottom: 15,
                }}
              >
                {error && error}
              </div>
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                style={{ width: '100%' }}
                variant='contained'
                color='primary'
                aria-label='contained primary button group'
              >
                <ButtonGroup
                  style={{ width: '100%' }}
                  variant='contained'
                  color='primary'
                  aria-label='contained primary button group'
                >
                  <Button disabled={loading}>
                    <AddBoxRounded />
                  </Button>
                  <Button
                    disabled={loading}
                    type='submit'
                    style={{
                      width: '100%',
                      borderRight: 'none',
                    }}
                  >
                    {loading && (
                      <CircularProgress size={20} color='secondary' />
                    )}
                    Add Reply
                  </Button>
                </ButtonGroup>

                <ButtonGroup
                  style={{ width: '100%' }}
                  variant='contained'
                  color='primary'
                  aria-label='contained primary button group'
                >
                  <div
                    // className={classes.root}
                    style={{ width: '100%' }}
                  >
                    {/* <input
                                        accept='image/*'
                                        className={classes.uploadInput}
                                        id='contained-button-file'
                                        // multiple
                                        type='file'
                                        // onChange={addNewFile}
                                        onChange={handleFileChange}
                                    /> */}

                    {/* <label htmlFor='contained-button-file'> */}
                    <Button
                      style={{ width: '100%' }}
                      variant='contained'
                      color='primary'
                      component='span'
                      // onClick={addFile}
                      onClick={openModal}
                    >
                      Upload
                    </Button>
                    {/* </label> */}
                  </div>

                  <Button>
                    <AddBoxRounded />
                  </Button>
                </ButtonGroup>
              </ButtonGroup>
            </Grid>
          </form>
        </Grid>
      </Grid>

      <UploadModal
        progress={progress}
        openModal={openModal}
        open={open}
        loading={loadingModal}
        setLoading={setLoadingModal}
        addFile={addFile}
        closeModal={closeModal}
      />
    </>
  );
};

export default Messages;
