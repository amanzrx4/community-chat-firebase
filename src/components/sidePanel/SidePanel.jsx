import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import UserPanel from './UserPanel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/styles';
import {
    Collapse,
    ListItemSecondaryAction,
    IconButton,
} from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        margin: 'auto',
        marginTop: 20,
        color: 'white',
        overflow: 'auto',
    },
    '@keyframes spin': {
        ' 0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
    rotateIcon: {
        animation: '$spin .15s ease-in ',
    },
}));

const SidePanel = () => {
    const classes = useStyles();

    const [state, setState] = React.useState(false);
    return <div className={classes.root}>hello worl</div>;
};

function ListItemLink(props) {
    return <ListItem button component='a' {...props} />;
}
export default SidePanel;
