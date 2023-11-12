import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppMenu from './AppMenu';
import { Link } from 'react-router-dom';

export const DashboardSidebar = (props: any) => {
  const { open, onClose, openMobile, closeMobile } = props;
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'), {
    defaultMatches: true,
    noSsr: false,
  });

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div>
          <Box
            sx={{
              pl: 2,
              bottomBorder: '1px solid',
              backgroundColor: 'rgb(35, 48, 68)',
              height: 64,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'inline-block',
                height: '32px',
                width: '75',
                borderRadius: 1,
              }}
            ></Box>
          </Box>
        </div>

        <AppMenu closeMobile={closeMobile} />
      </Box>
    </>
  );

  if (mdUp) {
    return (
      <Drawer
        transitionDuration={300}
        anchor="left"
        onClose={onClose}
        open={open}
        PaperProps={{
          sx: {
            width: 230,
            backgroundColor: 'rgb(35, 48, 68)',
          },
        }}
        variant="persistent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      transitionDuration={500}
      anchor="left"
      variant="temporary"
      onClose={closeMobile}
      open={openMobile}
      ModalProps={{
        keepMounted: false,
      }}
      PaperProps={{
        sx: {
          backgroundColor: 'rgb(35, 48, 68)',
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
    >
      {content}
    </Drawer>
  );
};
