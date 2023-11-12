import { useMemo, useState } from 'react';
import { Box, createTheme } from '@mui/material';
import styled from '@mui/material/styles/styled';
import { DashboardSidebar } from '../components/Layouts/Sidebar';
import { DashboardNavbar } from '../components/Layouts/Header';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Outlet } from 'react-router-dom';

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

const Root = (props: any) => {
  const { children } = props;
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

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
            <div className="px-8 pt-4" id="detail">
              <Outlet />
            </div>
          ) : (
            <Main className="px-10 pt-4" id="detail" open={isSidebarOpen}>
              <Outlet />
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

export default Root;
