import { Divider, Paper } from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 20,
    display: 'flex',
    width: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'start',
    flexDirection: 'row',
    backgroundColor: 'rgba(234, 234, 234,0.9)',
    borderLeft: '10px solid blue',

    fontFamily: ` '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'`,
  },
  miniflex: {
    display: 'flex',
    justifyContent: 'start',
    alignContent: 'start',
    alignItems: 'start',
    height: '100%',
    flexDirection: 'column',
  },
}));

const Mess = ({ message }) => {
  const classes = useStyles();
  // console.log('file got', message.image);
  return (
    <>
      {!message.hasOwnProperty('user') ? (
        <div>no messages to show here</div>
      ) : (
        <Paper className={classes.paper} style={{ padding: 8 }} elevation={0}>
          <div>
            <img
              src={message.user.avatar}
              style={{
                marginTop: '10px',
                marginBottom: '10px',
                padding: 0,
                borderRadius: '20%',
                width: '60px',
                height: '60px',
              }}
            />
          </div>

          <Divider orientation='vertical' style={{ margin: 8 }} flexItem />

          <div className={classes.miniflex}>
            <div style={{ marginBottom: 5 }}>
              <span>
                <strong>{message.user.name}</strong>
              </span>
              <span style={{ color: 'grey', fontSize: '13px' }}>
                {' '}
                {moment(message.timeStamp).fromNow()}
              </span>
            </div>
            {message.image ? (
              <img
                style={{ width: '50%', height: '50%' }}
                src={message.image}
              />
            ) : (
              <div>{message.content}</div>
            )}
          </div>
        </Paper>
      )}
    </>
  );
};
export default Mess;
