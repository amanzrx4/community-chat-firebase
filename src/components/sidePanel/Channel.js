import {
    Badge,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import InboxIcon from '@material-ui/icons/Inbox';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { connect } from 'react-redux';

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

const Channel = ({
    setState,
    channel,
    setChannel,
    setOpen,
    state,
    setCurrentChannel,
    currentChannel,
    setPrivateChannel,
}) => {
    const [firstLoad, setFirstLoad] = useState(true);
    const [activeClass, setActiveClass] = useState('');

    const [channelPublic, setChannelPublic] = useState({
        channelPub: null,
        channelsRef: ref(db, 'channels'),
        messagesRef: ref(db, 'messages'),
    });

    const [notifications, setNotifications] = useState([]);

    const { channelPub, channelsRef, messagesRef } = channelPublic;

    useEffect(() => {
        console.log('current channel', typeof currentChannel);

        let channelsArray = [];

        const childAdded = onChildAdded(query(ref(db, '/channels')), (snap) => {
            console.log('snap size', snap.key);
            channelsArray.push(snap.val());

            // console.log('messages ref', child(messagesRef, `/${snap.key}`));

            setChannel([...channelsArray]);

            console.log('channel state', channel);
            setChannelPublic((prev) => ({
                ...prev,
                channelPub: currentChannel,
            }));

            if (firstLoad && channelsArray.length > 0 && !currentChannel) {
                console.log('yes current channel');
                setCurrentChannel(channelsArray[0]);
                setChannelPublic((prev) => ({
                    ...prev,
                    channelPub: channelsArray[0],
                }));
                setActiveClass(channelsArray[0].id);
                setFirstLoad(false);
                console.log('initial channel set');
            }

            addNotificationListner(snap.key);
        });

        return () => {
            childAdded();
        };
    }, [currentChannel]);

    const addNotificationListner = (channelId) => {
        if (!currentChannel) return;

        let refNew = child(ref(db, 'messages'), channelId);
        console.log('channel pub', channelId);

        onValue(refNew, (snap) => {
            if (channelPub) {
                console.log('yes channel pub', snap);
                handleNotification(channelId, channel.id, notifications, snap);
            }
        });
    };

    const handleNotification = (
        channelId,
        currentChannelId,
        notifications,
        snap
    ) => {
        let newArray = [];
        console.log('yes handle notificstions');
        let lastTotal = 0;
        // if (notifications.length == 0) return;

        let index = notifications.findIndex(
            (notification) => notification.id == channelId
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
            const newArr = {
                id: channelId,
                total: snap.size,
                lastKnownTotal: snap.size,
                count: 0,
            };
            console.log('new array', newArray);
            // notifications.push({
            //     id: channelId,
            //     total: snap.size(),
            //     lastKnownTotal: snap.size(),
            //
            //     count: 0,
            // });
            // setNotifications(notifications.concat(newArray));
            setNotifications((prev) => [...prev, newArr]);
        }
    };

    const clearNotifications = () => {
        let index = notifications.findIndex(
            (notification) => notification.id === channelPub.id
        );

        if (index !== -1) {
            let updatedNotifications = [...notifications];
            updatedNotifications[index].total =
                notifications[index].lastKnownTotal;

            updatedNotifications[index].count = 0;
            // setChannelPublic((prev) => ({
            //     ...prev,
            //     notifications: updatedNotifications,
            // }));
            // setNotifications(notifications.concat(updatedNotifications));
            setNotifications([updatedNotifications]);
        }
    };

    const getNotificationCount = (channelSp) => {
        let count = 0;
        if (!notifications.length == 0) return false;
        notifications.forEach((notification) => {
            if (notification.id == channelSp.id) {
                count = notification.count;
            }
            console.log('notification bro', notification);
        });
        if (count > 0) return count;
    };

    return (
        <>
            <ListItem style={{ borderRadius: 9, color: 'black' }} button>
                <ListItemText onClick={() => setState((prev) => !prev)}>
                    CHANNELS <span>({channel.length || 0}) </span>
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
                <Collapse unmountOnExit in={state} style={{ width: '100%' }}>
                    <List
                        component='nav'
                        aria-label='main mailbox folders'
                        style={{ width: '100%' }}
                    >
                        {channel.length > 0 &&
                            channel.map((ch) => (
                                <ListItem
                                    name={ch.name}
                                    style={{ width: '100%' }}
                                    selected={ch.id === activeClass}
                                    onClick={() => {
                                        setCurrentChannel(ch);
                                        setPrivateChannel(false);
                                        setActiveClass(ch.id);
                                        clearNotifications();
                                        setChannelPublic((prev) => ({
                                            ...prev,
                                            channelPub: ch,
                                        }));
                                    }}
                                    key={ch.id}
                                    button
                                >
                                    <ListItemIcon>
                                        <Badge
                                            color='secondary'
                                            badgeContent={
                                                getNotificationCount || null
                                            }
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
