import { ActionCodeOperation } from '@firebase/auth';
import ACTIONS from './actionTypes';

export const setUser = (user) => {
    return {
        type: ACTIONS.SET_USER,
        payload: {
            currentUser: user,
        },
    };
};

export const clearUser = () => {
    return {
        type: ACTIONS.CLEAR_USER,
    };
};

// channel action types
export const setCurrentChannel = (channel) => {
    return {
        type: ACTIONS.SET_CURRRENT_CHANNEL,
        payload: {
            currentChannel: channel,
        },
    };
};

export const setPrivateChannel = (isPrivateChannel) => {
    return {
        type: ACTIONS.SET_PRIVATE_CHANNEL,
        payload: { isPrivateChannel },
    };
};
