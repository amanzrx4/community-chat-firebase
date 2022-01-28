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
  const [snapKey, setSnapKey] = useState([]);
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
  const [firstLoad, setFirstLoad] = useState(true);
  const [firstchannel, setFirstChannel] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { channelPub, channelsRef, messagesRef } = channelPublic;

  const [channelsArray, setChannelsArray] = useState([]);

  const [exp, setExp] = useCallbackState([]);

  const [snap, setSnap] = useState([]);

  const [states, setStates] = useState({
    notifications: [],
  });
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    // jhj
    let loadedChannel = [];
    const childAdded = onChildAdded(ref(db, 'channels'), (snapshot) => {
      loadedChannel.push(snapshot.val());
      setChannels(loadedChannel);
      if (loadedChannel.length > 0) setChannel(loadedChannel[0]);
      // const dataSnap = snapshotToArray(snapshot.val());
      // const ty = snapshot;
      // console.log(snapshot);
      // setChannels(dataSnap);
      // if (channels) setCurrentChannel(channels?.channels[0]);
      // setFirstChannel(channels?.[0]);
      // setActiveClass(channels[0]?.id);
      // addNotificationListner(snap.key);

      setSnap((prev) => [...prev, snapshot]);

      console.log('datasnap object hai bhai ji', snapshot.val());

      addNotificationListner(snapshot.key);

      //   snap && console.log('yuehu eh ef', snap?.val());
      // if (!channel) {
      //     if (channel && !channel.includes(newArrayItem)) {
      //         return setChannel((prev) => [...prev, newArrayItem]); // setting the channels..
      //     }
      //     setChannel([newArrayItem]); // setting the channels..
      // }
      // let newArrayItem = snap.val();
      // if (!channel.includes(newArrayItem)) {
      //     setChannel((prev) => [...prev, newArrayItem]); // setting the channels..
      // }

      //                                                          array state variable

      // if (channel.length > 0 && currentChannel == null) {
      // setCurrentChannel(channel[0]);
      // }
      //                                 but bcz channel array is not yet populated
      //                                , it gives error

      // addNotificationListner(snap.key); //expects the channel array
      // setChannelonFirstLoad();

      // if (firstLoad && channelsArray.length > 0 && !currentChannel) {

      // channelsArray.push(snap.val());
      // setChannelsArray((prev) => [...prev, snap.val()]);
      // console.log('channels array', channelsArray);
      //     console.log('yes current channel');
      //     setCurrentChannel(channelsArray[0]);
      //     setChannelPublic((prev) => ({
      //         ...prev,
      //         channelPub: channelsArray[0],channel
      //     }));
      //     setActiveClass(channelsArray[0].id);
      //     setFirstLoad(false);
      //     console.log('initial channel set');
      // }
    });
    return () => {
      childAdded();
    };
  }, []);

  useEffect(() => {
    if (channels.length > 0) {
      setCurrentChannel(channels[0]);
      setActiveClass(channels[0].id);
    }

    console.log('bhai multiple hai yr');
  }, [channels]);

  // useEffect(() => {

  //     if (firstLoad && channel.length > 0) {
  //         console.log('channel array bro', channel);
  //         setCurrentChannel(channel[0]);
  //         setActiveClass(channel[0].id);
  //         setFirstChannel(channel[0]);
  //         setFirstLoad(false);
  //     }
  // }, [channel]);

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
    let newArr = [];
    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );
    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snap.size - lastTotal > 0) {
          notifications[index].count = snap.size - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.size;
    } else {
      console.log('else block bro');
      notifications.push({
        id: channelId,
        total: snap.size,
        lastKnownTotal: snap.size,
        count: 0,
      });
      setNotifications((prev) => [...prev, notifications]);
    }
  };

  const clearNotifications = () => {
    let index = notifications.findIndex(
      (notification) => notification.id === firstchannel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;

      updatedNotifications[index].count = 0;
      // setChannelPublic((prev) => ({
      //     ...prev,
      //     notifications: updatedNotifications,
      // }));
      // setNotifications(notifications.concat(updatedNotifications));
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
                      badgeContent={getNotificationCount(ch)}
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
