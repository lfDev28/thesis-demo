import React from 'react';
import { TOption } from '../../routes/automations/Automation';
import TextField from '@mui/material/TextField';
import Menu  from '@mui/material/Menu';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import SelectOption from './SelectOption';

type TParamsMenuProps = {
    option: TOption | null;
    onParamChange: (uniqueId: string, key: string, value: any) => void;
    anchorEl: null | HTMLElement;
    handleClose: () => void;
    };

const ParamsMenuComp = ({ option, onParamChange, anchorEl, handleClose }: TParamsMenuProps) => {
    if(!option) return null


  const handleParamChange = (paramName: string, newValue: any) => {
    onParamChange(option.uniqueId, paramName, newValue);
  };



  return (
    <Menu
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}

    PaperProps={{
      style: {
        maxHeight: 500,
        width: '20vw',
      },
    }}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
  >
    
    {option &&
      option.params &&
      Object.keys(option.params).map((key) => {
        const fieldData = option.params[key];
        switch (fieldData.type) {
          case 'text':
            return (
                // Disable highlighting menu item behaviour on click
            <MenuItem disableRipple disableTouchRipple sx={
                {
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }
            } >
              <TextField
                key={key}
                fullWidth
                variant="outlined"
                label={key}
                value={fieldData.value}
                onChange={(e) => handleParamChange(key, e.target.value)}
              />
              </MenuItem>
            );
          case 'number':
            return (
                <MenuItem disableRipple disableTouchRipple sx={  {
                    '&:hover': {
                        backgroundColor: 'transparent'
                    },
                }}>
              <TextField
                key={key}
                fullWidth
                variant="outlined"
                label={key}
                value={fieldData.value}
                onChange={(e) => handleParamChange(key, e.target.value)}
              />
              </MenuItem>
            );
          case 'select':
            return (
                <MenuItem disableRipple disableTouchRipple>
              <SelectOption
                key={key}
                value={fieldData}
                onParamChange={handleParamChange}
                uniqueId={option.uniqueId}
              />
                </MenuItem>
            );
            default:
                return null;

        }
        }
        )}

  </Menu>


  );
};

export default  ParamsMenuComp;
