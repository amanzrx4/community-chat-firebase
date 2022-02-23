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
  getNotificationCount,
  // notifications,
  currentChannel,
}) => {
  const [notificationBadge, setNotificationBadge] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotificationListner = (channelId) => {
    onValue(ref(db, 'messages' + '/' + channelId), (snap) => {
      if (channel) {
        console.log('snap size{{{{{{{{{{{{{', snap);
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
    }
    setNotifications([newArr]);
  };

  useEffect(() => {
    setNotificationBadge(getNotificationCount(channel));
  }, [notifications]);

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
