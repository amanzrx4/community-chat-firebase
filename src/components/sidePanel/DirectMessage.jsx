import {
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
} from '@material-ui/core';

import { IconButton } from '@material-ui/core';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import InboxIcon from '@material-ui/icons/Inbox';

import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { connect } from 'react-redux';

import { db } from '../../firebase/config';
import {
  getDatabase,
  ref as dbRef,
  child,
  push,
  set,
  serverTimestamp,
  onChildChanged,
  query,
  get,
  onChildAdded,
  onValue,
  onDisconnect,
  onChildRemoved,
} from 'firebase/database';

import React, { useEffect, useState } from 'react';

const DirectMessage = ({
  currentUser,
  setCurrentChannel,
  setPrivateChannel,
}) => {
  const [users, setUsers] = useState({
    user: currentUser,
    users: [],
    connectedRef: dbRef(db, '.info/connected'),
    presenseRef: dbRef(db, 'presense'),
  });
  const [activeDm, setActiveDm] = useState('');

  useEffect(() => {
    if (currentUser) {
      let loadedUsers = [];
      let currentUserUid = currentUser.uid;

      onChildAdded(dbRef(db, 'users'), (snap) => {
        console.log(`direct messgae snap`, snap.key);
        if (currentUserUid != snap.key) {
          let user = snap.val();
          user['uid'] = snap.key;
          user['status'] = 'offline';
          loadedUsers.push(user);
          setUsers((prev) => ({ ...prev, users: loadedUsers }));
        }
      });

      onValue(users.connectedRef, (snap) => {
        let myObj = {};
        myObj[currentUserUid] = true;

        if (snap.val() === true) {
          set(dbRef(db, 'presense/'), myObj);
          const refNew = dbRef(db, `/presense/${currentUserUid}`);
          onDisconnect(refNew).set(false);
          onDisconnect(refNew).remove((err) => {
            if (err != null) {
              console.log(err);
            }
          });
          console.log('connected');
        } else {
          console.log('not connected');
        }

        onChildAdded(users.presenseRef, (snap) => {
          if (currentUserUid !== snap.key) {
            addStatusToUser(snap.key);
          }
        });

        onChildRemoved(users.presenseRef, (snap) => {
          addStatusToUser(snap.key, false);
        });
      });
    }
  }, [currentUser]);

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = users.users.reduce((acc, user) => {
      if (user.uid == userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    setUsers((prev) => ({
      ...prev,
      users: updatedUsers,
    }));
  };

  const changeChannel = (userIn) => {
    const channelId = getChannelId(userIn.uid);
    const channelData = {
      id: channelId,
      name: userIn.name,
    };
    setCurrentChannel(channelData);
    setPrivateChannel(true);
  };

  const getChannelId = (userId) => {
    const currentUserIdNew = currentUser.uid;
    return userId < currentUserIdNew
      ? `${userId}/${currentUserIdNew}`
      : `${currentUserIdNew}/${userId}`;
  };

  return (
    <>
      <ListItem style={{ borderRadius: 9, color: 'black' }} button>
        <ListItemText>
          Direct messages <span>{0} </span>
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton edge='end' aria-label='delete'>
            <LibraryAddOutlinedIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem style={{ width: '100%', padding: '8px' }}>
        <Collapse unmountOnExit in={true} style={{ width: '100%' }}>
          <List
            component='nav'
            aria-label='main mailbox folders'
            style={{ width: '100%' }}
          >
            {users.users.length > 0 &&
              users.users.map((user) => (
                <ListItem
                  selected={user.uid === activeDm}
                  key={user.uid}
                  style={{ width: '100%' }}
                  onClick={() => {
                    changeChannel(user);
                    setActiveDm(user.uid);
                  }}
                  button
                >
                  <ListItemIcon>
                    <Radio
                      checked={user?.status === 'online'}
                      value='a'
                      name='radio-buttons'
                      inputProps={{ 'aria-label': 'A' }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
          </List>
        </Collapse>
      </ListItem>
    </>
  );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessage
);
