import {
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { snapshotToArray } from '../../utils/snapshotArray';
import { IconButton } from '@material-ui/core';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import InboxIcon from '@material-ui/icons/Inbox';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { connect } from 'react-redux';
import ACTIONS from '../../actions/actionTypes';
import { db } from '../../firebase/config';
import {
  getDatabase,
  ref,
  child,
  push,
  set,
  serverTimestamp,
  onChildChanged,
  query,
  get,
  onValue,
  onChildAdded,
} from 'firebase/database';

import React, { useEffect, useState } from 'react';
import { CodeSharp } from '@material-ui/icons';
import { useCallbackState } from './useCallbackState';

import { useDispatch, useSelector } from 'react-redux';
const Channel = ({
  channels,
  setChannels,
  setOpen,
  setCurrentChannel,
  currentChannel,
  setPrivateChannel,
}) => {
  const initialNumuniqueUsers = null;
  const [numuniqueUsers, setNumuniqueUsers] = useState(initialNumuniqueUsers);

  const [listOpen, setListOpen] = useState(false);
  const messagesLoading = useSelector((state) => state.messagesLoading);
  const dispatch = useDispatch();

  const [activeClass, setActiveClass] = useState('');
  const [channelPublic, setChannelPublic] = useState({
    channelPub: null,
    channelsRef: ref(db, 'channels'),
    messagesRef: ref(db, 'messages'),
  });
  const [firstchannel, setFirstChannel] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // const [states, setStates] = useState({

  // });
  const [notificationBadge, setNotificationBadge] = useState();
  const [channel, setChannel] = useState({});
  let loadedChannel = [];

  useEffect(() => {
    const childAdded = onChildAdded(ref(db, 'channels'), (snapshot) => {
      loadedChannel.push(snapshot.val());
      setChannels(loadedChannel);
      setChannel(loadedChannel?.[0]);
      // if (loadedChannel.length > 0) setChannel(loadedChannel[0]);
      // setSnap((prev) => [...prev, snapshot]);
      console.log('datasnap object hai bhai ji', snapshot.val());

      // setChannel(loadedChannel[0]);
      addNotificationListner(snapshot.key);
    });
    return () => {
      childAdded();
    };
  }, []);

  useEffect(() => {
    if (loadedChannel) {
      setChannel(loadedChannel[0]);
    }
  }, [channels]);

  useEffect(() => {
    if (channels.length > 0) {
      setCurrentChannel(channels[0]);
      setActiveClass(channels[0].id);
    }

    console.log('bhai multiple hai yr');
  }, [channels]);

  useEffect(() => {
    setNotificationBadge(getNotificationCount(channel));
  }, [channel]);

  const addNotificationListner = (channelId) => {
    onValue(ref(db, 'messages' + '/' + channelId), (snap) => {
      if (channel) {
        console.log('yes currentCHannel works');
        handleNotification(channelId, channel.id, notifications, snap);
      } else {
        console.log('current channel doent work');
      }
    });
  };

  const handleNotification = (
    channelId,
    currentChannelId,
    notifications,
    snap
  ) => {
    let lastTotal = 0;
    let newArr = Array.from(notifications);
    let index = newArr.findIndex(
      (notification) => notification.id === channelId
    );
    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = newArr[index].total;
        if (snap.size - lastTotal > 0) {
          newArr[index].count = snap.size - lastTotal;
        }
      }
      newArr[index].lastKnownTotal = snap.size;
    } else {
      console.log('else block bro');
      newArr.push({
        id: channelId,
        total: snap.size,
        lastKnownTotal: snap.size,
        count: 0,
      });
      setNotifications(notifications);
    }
  };

  const clearNotifications = () => {
    if (notifications.length < 1) return;

    let index = notifications.findIndex(
      (notification) => notification.id === firstchannel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;

      updatedNotifications[index].count = 0;

      setNotifications([updatedNotifications]);
    }
  };

  function currentChannelUpdate(ch) {
    if (currentChannel == ch) return;
    setCurrentChannel(ch);
    setChannel(ch);
    setActiveClass(ch.id);
    setPrivateChannel(false);
    dispatch({ type: ACTIONS.MESSAGES_LOADING_START });
    setNumuniqueUsers(initialNumuniqueUsers);
    clearNotifications();
  }

  const getNotificationCount = (channel) => {
    let count = 0;
    // if (!notifications.length == 0) return false;
    notifications.forEach((notification) => {
      if (notification.id == channel.id) {
        count = notification.count;
      }
    });
    if (count > 0) {
      console.log('count is working yr', count);
      return count;
    }
  };

  const getNotificationBadge = (channel) => {
    const notification = getNotificationCount(channel);
  };

  return (
    <>
      <ListItem
        onClick={() => setListOpen((prev) => !prev)}
        style={{ borderRadius: 8, color: 'black' }}
        button
      >
        <ListItemText>
          CHAN9NELS <span>{channels?.length} </span>
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton
            edge='end'
            aria-label='delete'
            onClick={() => setOpen((prev) => !prev)}
          >
            <LibraryAddOutlinedIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem style={{ width: '100%', padding: '8px' }}>
        <Collapse unmountOnExit in={listOpen} style={{ width: '100%' }}>
          <List
            component='nav'
            aria-label='main mailbox folders'
            style={{ width: '100%' }}
          >
            {channels.length > 0 &&
              channels.map((ch) => (
                <ListItem
                  name={ch.name}
                  style={{ width: '100%' }}
                  selected={ch.id === activeClass}
                  onClick={() => {
                    currentChannelUpdate(ch);

                    // setChannelPublic((prev) =f> ({
                    //     ...prev,
                    //     channel: ch,
                    // }));
                    setFirstChannel(ch);
                  }}
                  key={ch.id}
                  button
                >
                  <ListItemIcon>
                    <Badge
                      color='secondary'
                      badgeContent={notificationBadge}
                      max={999}
                    >
                      <InboxIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary={ch.name} />
                </ListItem>
              ))}
          </List>
        </Collapse>
      </ListItem>
    </>
  );
};

const mapStateFromProps = (state) => ({
  currentChannel: state.channel.currentChannel,
});
export default connect(mapStateFromProps, {
  setCurrentChannel,
  setPrivateChannel,
})(Channel);
