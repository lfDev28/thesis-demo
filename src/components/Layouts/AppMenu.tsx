import React from 'react';
import List from '@mui/material/List';
import AppMenuItem from './AppMenuItem';
import { Routes } from './Routes';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';

const AppMenu: React.FC<any> = ({ closeMobile }) => {
  return (
    <List component="nav" disablePadding>
      {Routes.map((item: any, index: any) =>
        !item?.items ? (
          <Link to={item.link}>
            <AppMenuItem
              {...item}
              key={index}
              textSize={16}
              closeMobile={closeMobile}
            />
          </Link>
        ) : (
          <AppMenuItem
            {...item}
            key={index}
            textSize={16}
            closeMobile={closeMobile}
          />
        )
      )}
    </List>
  );
};

export default AppMenu;
