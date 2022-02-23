import {
  Grid,
  Menu,
  MenuItem,
  Box,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  ListItemAvatar,
  ListItemText,
  List,
  ListItem,
  Collapse,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// import { connect } from 'react-redux';
// import { auth } from '../../firebase/config';

import { signOut } from 'firebase/auth';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

import PlaylistAddOutlinedIcon from '@material-ui/icons/PlaylistAddOutlined';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import ChannelModal from './ChannelModal';
import Channel from './Channel';

import {
  getDatabase,
  ref,
  child,
  push,
  set,
  serverTimestamp,
  onChildChanged,
  query,
} from 'firebase/database';

import { db, auth } from '../../firebase/config';

import DirectMessage from './DirectMessage';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: '50%',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    // overflow: 'scroll',

    padding: 0,
    margin: 0,
  },
  flex2: {
    width: '100%',
  },
  list: {
    width: '100%',
  },
  '@keyframes spin': {
    ' 0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(180deg)' },
  },
  rotateIcon: {
    animation: '$spin .15s ease-in ',
    // cursor: 'pointer',
  },
}));

const UserPanel = ({ currentUser }) => {
  const classes = useStyles();
  const [age, setAge] = React.useState('');
  const [state, setState] = React.useState(false);

  const [channels, setChannels] = useState([]);

  const handleSignOut = () => {
    console.log('signed out');
    signOut(auth).then(() => console.log('signed out again'));
    // console.log(auth);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const obj = [
    {
      text: (
        <span>
          Signed in as <strong>{currentUser.displayName || ''} </strong>
        </span>
      ),
      disabled: true,
    },
    {
      text: 'Avatar',
    },
    {
      text: <span onClick={handleSignOut}>Sign out</span>,
    },
  ];

  useEffect(() => {
    console.log('user from redux');
  }, []);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={classes.flex}>
        <List className={classes.list}>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={currentUser.photoURL} alt='your avatar' />
            </ListItemAvatar>

            <ListItemText>
              <FormControl className={classes.flex2}>
                <InputLabel id='demo-simple-select-label'>
                  <strong> {currentUser.displayName}</strong>
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={age}
                  onChange={handleChange}
                >
                  {obj.map((o, index) => (
                    <MenuItem
                      disabled={o.disabled}
                      key={index}
                      value={20}
                      onClick={handleSignOut}
                    >
                      {o.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItemText>
          </ListItem>
          <ListItem style={{ padding: 0 }}>
            <List
              className={classes.list}
              component='nav'
              aria-label='main mailbox folders'
              disabled
            >
              <Channel
                channels={channels}
                setState={setState}
                setChannels={setChannels}
                setOpen={setOpen}
                state={state}
              />

              <DirectMessage currentUser={currentUser} />
            </List>
          </ListItem>
        </List>
      </div>
      <ChannelModal
        channels={channels}
        open={open}
        setOpen={setOpen}
        setChannels={setChannels}
      />
    </>
  );
};

export default UserPanel;
