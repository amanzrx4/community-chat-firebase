import { useState, useEffect } from 'react';
import React from 'react';

import {
  Grid,
  Divider,
  Paper,
  Box,
  Container,
  IconButton,
  Input,
  ButtonGroup,
  Button,
  TextField,
} from '@material-ui/core';
import Messages from './messages/Messages';
import { makeStyles } from '@material-ui/core/styles';
import UserPanel from './sidePanel/UserPanel';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { connect } from 'react-redux';
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
  onChildAdded,
} from 'firebase/database';

import { db } from '../firebase/config';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  height1: {
    height: '100vh',
  },
  height2: {
    backgroundColor: 'blue',
    height: '100%',
  },
  back: {
    backgroundColor: 'yellow',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    display: 'flex',
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
  container: {
    width: '70px',
    margin: 0,
    padding: 0,
    backgroundColor: 'Red',
    height: '100%',
    alignItems: 'stretch',
  },
  userPanel: {
    // width: '100%',
    flexGrow: 4,
    marginRight: 'auto',
  },
  divFlex: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  item1: {
    display: 'flex',
    flexDirection: 'column',
    width: '15%',
    alignItems: 'center',
    marginTop: 2,
  },
  item2: {
    width: '100%',
    overflow: 'scroll',
  },
  input: {
    padding: '14px 8px',
  },
  adornedStart: {
    paddingLeft: 0,
  },
}));

// useEffect(()=>{})

function App({ currentUser, currentChannel, isPrivateChannel }) {
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeClass, setActiveClass] = useState('');
  const [channel, setChannel] = useState([]);

  const classes = useStyles();
  // useEffect(() => {
  //     console.log('current channel', currentChannel);
  //     let channelsArray = [];
  //     const childAdded = onChildAdded(query(ref(db, '/channels')), (snap) => {
  //         channelsArray.push(snap.val());
  //         setChannel([...channelsArray]);

  //         console.log('channel state', channel);

  //         //currentChannel & setCurrentChanel coming from redux,currentChannel initialized to null
  //         //set current channel is
  //         if (firstLoad && channelsArray.length > 0 && !currentChannel) {
  //             setCurrentChannel(channelsArray[0]);
  //             setActiveClass(channelsArray[0].id);
  //             setFirstLoad(false);
  //             console.log('initial channel set');
  //         }
  //     });

  //     return () => {
  //         childAdded();
  //     };
  // }, []);
  return (
    <div className={classes.root} style={{ overflow: 'hidden' }}>
      <Grid
        container
        className={classes.height1}
        alignItems='stretch'
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        <Grid item xs={3} style={{ width: '100%', height: '100%' }}>
          <div className={classes.divFlex} style={{ height: '100%' }}>
            <div className={classes.item1}>
              <IconButton>
                <AddCommentIcon fontSize='large' />
              </IconButton>
            </div>
            <Divider orientation='vertical' flexItem />
            <div className={classes.item2} style={{ height: '100%' }}>
              <UserPanel currentUser={currentUser} />
            </div>
          </div>
        </Grid>

        <Messages
          currentUser={currentUser}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid>
    </div>
  );
}
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
});
export default connect(mapStateToProps)(App);
