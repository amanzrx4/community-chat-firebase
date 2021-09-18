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
        notifications: [],
    });

    const { channelPub, channelsRef, messagesRef, notifications } =
        channelPublic;

    useEffect(() => {
        console.log('current channel', currentChannel);
        let channelsArray = [];
        const childAdded = onChildAdded(query(ref(db, '/channels')), (snap) => {
            channelsArray.push(snap.val());

            setChannel([...channelsArray]);

            console.log('channel state', channel);
            addNotificationListner(snap.key);

            if (firstLoad && channelsArray.length > 0 && !currentChannel) {
                setCurrentChannel(channelsArray[0]);
                setChannelPublic((prev) => ({
                    ...prev,
                    channelPub: channelsArray[0],
                }));
                setActiveClass(channelsArray[0].id);
                setFirstLoad(false);
                console.log('initial channel set');
            }
        });

        return () => {
            childAdded();
        };
    }, []);

    const addNotificationListner = (channelId) => {
        onValue(child(channelsRef, channelId), (snap) => {
            if (channelPub) {
                console.log('yes channel pub');
                handleNotification(channelId, channel.id, notifications, snap);
            }
        });
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
            setChannelPublic((prev) => ({
                ...prev,
                notifications: updatedNotifications,
            }));
        }
    };

    const getNotificationCount = (channelSp) => {
        let count = 0;
        notifications.forEach((notification) => {
            if (notification.id === channelSp.id) {
                count = notification.count;
            }
        });
        if (count > 0) return count;
    };

    const handleNotification = (
        channelId,
        currentChannelId,
        notifications,
        snap
    ) => {
        console.log('yes handle notificstions');
        let lastTotal = 0;
        let index = notifications.findIndex(
            (notification) => notification.id == channelId
        );
        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;
                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                totalValue: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0,
            });
        }
        setChannelPublic((prev) => ({ ...prev, notifications }));
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
                                            badgeContent={getNotificationCount()}
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
