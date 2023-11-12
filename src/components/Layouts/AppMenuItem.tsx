//@ts-nocheck
import React from 'react';

import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

const AppMenuItem: React.FC = (props) => {
  const {
    name,
    Icon,
    link,
    isChild,
    items = [],
    textSize,
    iconSize,
    closeMobile,
  } = props;

  const isExpandable = items && items.length > 0;
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const activeChild = false;
  const activeParent = false;
  const MenuItemRoot = (
    <ListItemButton
      onClick={handleClick}
      size="sm"
      disableRipple
      disableTouchRipple
      sx={{
        '&:hover': {
          // Put hexcode for gray below
          backgroundColor: '#0000000',
        },
        mx: isChild ? 3 : 1,
        borderRadius: 3,
      }}
    >
      <ListItemIcon>
        <Icon
          sx={{
            fontSize: iconSize ? iconSize : 22,
          }}
        />
      </ListItemIcon>

      <ListItemText
        primary={name}
        inset={!Icon}
        primaryTypographyProps={{
          fontSize: textSize ? textSize : 16,
        }}
      />
      {isExpandable && !open && <ExpandMore />}
      {isExpandable && open && <ExpandLess />}
    </ListItemButton>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {items.map((item, index) => (
          <Link to={item.link} key={index}>
            <AppMenuItem {...item} key={index} textSize={14} iconSize={16} />
          </Link>
        ))}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};

export default AppMenuItem;
