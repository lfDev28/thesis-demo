import React from 'react';
import { TOption } from '../../routes/automations/Automation';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TCalibrationData } from '../spectrometer/ElExperimentForm';
import getElapsedTime from '../../utils/getElapsedTime';
import generateMockCalibrations from '../../assets/MockCalibration';

type TParamsMenuProps = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  currentParams: TOption | null;
  paramValues: Record<string, any>;
  handleParamChange: (uniqueId: string, key: string, value: any) => void;
};

const ParamsMenu = ({
  anchorEl,
  handleClose,
  currentParams,
  paramValues,
  handleParamChange,
}: TParamsMenuProps) => {
  function renderCalibrationOption(calibrationData: TCalibrationData) {
    const description = calibrationData?.description || 'No description'; // Assuming metadata has a description. Modify as needed.
    return `${description.substring(0, 20)} - ${getElapsedTime(
      calibrationData.created_at.$date
    )}`;
  }

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
      {currentParams &&
        currentParams.params &&
        Object.keys(currentParams.params).map((key) => {
          const fieldData = currentParams.params[key];
          // If type is 'select' and specifically for Calibration
          if (fieldData.type === 'select' && key === 'Calibration') {
            const {
              data: calibration,
              isLoading,
              isError,
            } = useQuery({
              queryKey: [fieldData.optionsEndpoint],
              queryFn: async () => {
                // return generateMockCalibrations(5);
                const res = await axios.get(
                  fieldData.optionsEndpoint as string
                );
                return res.data;
              },
            });

            return (
              <div key={key} className="p-2">
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  label={key}
                  disabled={isLoading || !calibration || isError}
                  value={
                    paramValues[currentParams.uniqueId]?.[key] !== undefined
                      ? paramValues[currentParams.uniqueId]?.[key]
                      : ''
                  }
                  onChange={(e) =>
                    handleParamChange(
                      currentParams.uniqueId,
                      key,
                      e.target.value
                    )
                  }
                >
                  {calibration?.map((calibrationData: any) => (
                    <MenuItem
                      key={calibrationData._id.$oid}
                      value={calibrationData._id.$oid}
                    >
                      {renderCalibrationOption(calibrationData)}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            );
          } else {
            return (
              <div key={key} className="p-2">
                <TextField
                  required
                  fullWidth
                  label={key}
                  value={
                    paramValues[currentParams.uniqueId]?.[key] !== undefined
                      ? paramValues[currentParams.uniqueId]?.[key]
                      : fieldData.value || ''
                  }
                  type={fieldData.type || 'text'} // use the type from our metadata, default to text
                  {...(fieldData.type === 'number' && {
                    // conditionally spread these attributes if the type is 'number'
                    inputProps: {
                      min: fieldData.min,
                      max: fieldData.max,
                      step: fieldData.step,
                    },
                  })}
                  onChange={(e) =>
                    handleParamChange(
                      currentParams.uniqueId,
                      key,
                      e.target.value
                    )
                  }
                />
              </div>
            );
          }
        })}
    </Menu>
  );
};

export default ParamsMenu;
