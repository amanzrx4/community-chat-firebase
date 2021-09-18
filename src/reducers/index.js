import ACTIONS from '../actions/actionTypes';
import { combineReducers } from 'redux';
import actionTypes from '../actions/actionTypes';

const initialUserState = {
    currentUser: null,
    isLoading: true,
};

const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
};

const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case ACTIONS.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false,
            };
        case ACTIONS.CLEAR_USER:
            return {
                ...state,
                isLoading: false,
            };

        default:
            return state;
    }
};

const channelReducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case ACTIONS.SET_CURRRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel,
            };
        case ACTIONS.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel,
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    user: userReducer,
    channel: channelReducer,
});

export default rootReducer;
