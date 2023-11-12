import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import DarkModeToggle from '../main/DarkModeToggle';
import { ThemeContext } from '../Context/MuiThemeProvider';
import useAuth from '../../utils/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import Logout from '@mui/icons-material/Logout';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { EToastTypes, useToast } from '../Context/ToastContext';
import FlashlightOn from '@mui/icons-material/FlashlightOn';
import FlashlightOff from '@mui/icons-material/FlashlightOff';
import Tooltip from '@mui/material/Tooltip';

const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { theme, toggleDarkMode } = React.useContext(ThemeContext);
  const { logout } = useAuth();
  const { showTypedToast } = useToast();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const lampMutation = useMutation({
    mutationFn: async (state: boolean) => {
      const res = await axios.post(`/backend/calibration/calibration-lamp`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          state,
        },
      });
      return res.data;
    },
    onError: () => {
      showTypedToast(EToastTypes.ERROR, 'Failed to toggle lamp');
    },
    onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, 'Lamp toggled');
    },
  });

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          onClick={handleClick}
          disableRipple
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <SettingsRounded
            sx={{
              color: 'white',
            }}
          />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.default',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Tooltip title="Lamp Off">
            <IconButton onClick={() => lampMutation.mutate(false)}>
              <FlashlightOff />
            </IconButton>
          </Tooltip>

          <Tooltip title="Lamp On">
            <IconButton onClick={() => lampMutation.mutate(true)}>
              <FlashlightOn />
            </IconButton>
          </Tooltip>
        </MenuItem>

        <MenuItem>
          <DarkModeToggle />
          <p>Dark Mode</p>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <Logout /> Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default ProfileDropdown;
