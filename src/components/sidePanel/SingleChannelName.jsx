import React, { useState } from 'react';
import { Badge, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Inbox as InboxIcon } from '@material-ui/icons';
import { ref } from 'firebase/database';
import { db } from '../../firebase/config';
import { useEffect } from 'react';
import { onValue, onChildAdded } from 'firebase/database';

const SingleChannelName = ({
  channel,
  currentChannelUpdate,
  activeClass,

  // notifications,
  currentChannel,
}) => {
  const [notificationBadge, setNotificationBadge] = useState(null);
  const [notification, setNotification] = useState({});

  const addNotificationListner = (channelId) => {
    onValue(ref(db, 'messages' + '/' + channelId), (snap) => {
      if (channel) {
        console.log('snap size{{{{{{{{{{{{{', snap);
        handleNotification(channelId, snap);
      } else {
        console.log('current channel doent work');
      }
    });
  };

  const getNotificationCount = () => {
    console.log("notification count>>>>>>>>>", notification.count)
    return notification?.count;
  };

  const handleNotification = (channelId, snap) => {
    let lastTotal = 0;
    let newObj = {
      ...notification,
    };

    if (Object.keys(newObj).length === 0) {
      return setNotification({
        id: channelId,
        total: snap.size,
        lastKnownTotal: snap.size,
        count: 0,
      });
    }

    if (snap.size - newObj.total > 0) {
      newObj.count = snap.size - lastTotal;
      setNotification({ ...newObj });
    }
  };

  useEffect(() => {
    setNotificationBadge(getNotificationCount());
  }, [notification]);

  useEffect(() => {
    addNotificationListner(channel.id);
  }, []);

  return (
    <>
      <ListItem
        name={channel.name}
        style={{ width: '100%' }}
        selected={channel.id === activeClass}
        onClick={() => {
          currentChannelUpdate(channel);
        }}
        key={channel.id}
        button
      >
        <ListItemIcon>
          <Badge color='secondary' badgeContent={notificationBadge} max={999}>
            <InboxIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary={channel.name} />
      </ListItem>
    </>
  );
};

export default SingleChannelName;
