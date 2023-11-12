import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import styled from '@mui/material/styles/styled';
import { DashboardNavbar } from './Header';
import { DashboardSidebar } from './Sidebar';
import useMediaQuery from '@mui/material/useMediaQuery';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  backgroundColor: 'background.default',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    marginLeft: 230,
  },
}));

const drawerWidth = 230;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: 500,
  }),
  backgroundColor: theme.palette.background.default,
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: 500,
    }),
    marginLeft: 0,
  }),
}));

export const DashboardLayout = (props: any) => {
  const { children } = props;
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isMobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <div>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {!mdUp ? (
            <div className="px-8">{children}</div>
          ) : (
            <Main className="px-10 pt-4" open={isSidebarOpen}>
              {children}
            </Main>
          )}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar
        onSidebarOpen={() =>
          isSidebarOpen ? setSidebarOpen(false) : setSidebarOpen(true)
        }
        isOpen={isSidebarOpen}
        onMobileOpen={() => setMobileOpen(true)}
      />
      <DashboardSidebar
        onClose={() =>
          isSidebarOpen ? setSidebarOpen(false) : setSidebarOpen(true)
        }
        open={isSidebarOpen}
        openMobile={isMobileOpen}
        closeMobile={() =>
          isMobileOpen ? setMobileOpen(false) : setMobileOpen(true)
        }
      />
    </div>
  );
};
