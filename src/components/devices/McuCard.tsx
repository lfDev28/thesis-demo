import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import CancelRounded from '@mui/icons-material/CancelRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import Tooltip from '@mui/material/Tooltip';

import WarningRounded from '@mui/icons-material/WarningRounded';
import { TSerialPortData } from '../../App';

type TMcuCard = {
  device: string;
  header: string;
  subheader: string;
  handleChange: (port: string) => void;
  isLoading: boolean;
  error: any;
  devices: TSerialPortData[];
  connectMutation: any;
};

const ConnectionStatus = ({ mutationStatus }: any) => {
  return (
    <div>
      {mutationStatus.isError ? (
        <Tooltip title="Failed Connection">
          <CancelRounded color="error" />
        </Tooltip>
      ) : mutationStatus.isSuccess ? (
        <Tooltip title="Successful Connection">
          <CheckCircleRounded color="success" />
        </Tooltip>
      ) : (
        <Tooltip title="No Connection Attempted">
          <WarningRounded color="warning" />
        </Tooltip>
      )}
    </div>
  );
};

const McuCard = ({
  device,
  header,
  subheader,
  handleChange,
  isLoading,
  error,
  devices,
  connectMutation,
}: TMcuCard) => {
  return (
    <Card
      sx={{
        boxShadow: 0,
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <CardHeader
        title={header}
        subheader="Choose the devices port from the list below"
        avatar={device && <ConnectionStatus mutationStatus={connectMutation} />}
      />
      <CardContent>
        <TextField
          select={!isLoading && !error}
          disabled={isLoading || error}
          label={`${header} Port`}
          onChange={(e) => handleChange(e.target.value as string)}
          value={device}
          fullWidth
          InputProps={{
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="primary" size={30} thickness={6} />
                ) : device ? (
                  <IconButton
                    onClick={() => handleChange('')}
                    className="right-2"
                  >
                    <Delete />
                  </IconButton>
                ) : (
                  <></>
                )}
              </>
            ),
          }}
        >
          {isLoading ? (
            <MenuItem disabled value={device}>
              {device || 'Loading...'}
            </MenuItem>
          ) : error ? (
            <MenuItem disabled value={device}>
              Error: Could not find any devices
            </MenuItem>
          ) : (
            devices?.map((device, index: number) => {
              return (
                <MenuItem value={device.device} key={index}>
                  {`${device.device} - ${device.description}`}
                </MenuItem>
              );
            })
          )}
        </TextField>
        <CardActions>
          {device ? (
            <>
              {connectMutation?.isLoading ? (
                <CircularProgress color="primary" size={30} thickness={6} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => connectMutation.mutate({ port: device })}
                >
                  Test Connection
                </Button>
              )}
            </>
          ) : (
            <></>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default McuCard;
