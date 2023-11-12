import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';

type TDashboardNavbar = {
  onSidebarOpen: () => void;
  onMobileOpen: () => void;
  isOpen: boolean;
};

const DashboardNavbarRoot = styled(AppBar)(() => ({
  boxShadow: 'none',
}));

export const DashboardNavbar = (props: TDashboardNavbar) => {
  const { onSidebarOpen, onMobileOpen, isOpen, ...other } = props;

  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'), {
    defaultMatches: true,
    noSsr: true,
  });

  return (
    <>
      <DashboardNavbarRoot {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            px: 2,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid #e4e4e4',
          }}
        >
          {mdUp && (
            <IconButton
              onClick={onSidebarOpen}
              sx={{
                ml: isOpen ? 30 : 0,
              }}
            >
              <MenuIcon fontSize="small" sx={{ color: 'text.light' }} />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <ProfileDropDown />

          {!mdUp && (
            <IconButton
              onClick={onMobileOpen}
              sx={{
                display: {
                  xs: 'inline-flex',
                  lg: 'flex',
                },
              }}
            >
              <MenuIcon fontSize="small" sx={{ color: 'text.light' }} />
            </IconButton>
          )}
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};
