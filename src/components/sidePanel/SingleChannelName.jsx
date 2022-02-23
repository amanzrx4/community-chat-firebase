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
  notifications,
}) => {
  const [notificationBadge, setNotificationBadge] = useState(null);

  const handleNotification = () => {};

  useEffect(() => {
    setNotificationBadge(getNotificationCount(channel));
  }, [notifications]);

  useEffect(() => {
    onChildAdded(ref(db, 'messages' + '/' + channel.id), (snap) => {
      if (channel) {
        console.log('child ye ra ]]]]]]]]]]]]]]]', snap.val());
        // handleNotification(channelId, channel.id, notifications, snap);
      } else {
        console.log('current channel doent work');
      }
    });
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
