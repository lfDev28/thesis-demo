import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import CancelRounded from '@mui/icons-material/CancelRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import Tooltip from '@mui/material/Tooltip';
import WarningRounded from '@mui/icons-material/WarningRounded';
import { TSpectrometerData } from '../../App';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast, EToastTypes } from '../Context/ToastContext';
import SpectrometerModal from './SpectrometerModal';
import Info from '@mui/icons-material/Info';

type TSpectrometerCard = {
  spectrometer: TSpectrometerData;
  header: string;
  subheader: string;
  isLoading: boolean;
  error: any;
  refetch: () => void;
};



const SpectrometerCard = ({
  spectrometer,
  header,
  subheader,
  isLoading,
  error,
  refetch,
}: TSpectrometerCard) => {
  const {showTypedToast} = useToast();
  const [modal, setModal] = useState(false);

  const connectSpectrometer = useMutation({
    mutationKey: ['spectrometerConnect'],
    mutationFn: async (id: string) => {
      const res = await axios.post(`/backend/spectrometer/${id}/connect`);
      return res.data as any;
    }, onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, `Successfully connected to spectrometer: ${spectrometer?.name}`)
    }, onError: (err: any) => {
      showTypedToast(EToastTypes.ERROR, `Failed to connect to spectrometer: ${spectrometer?.name}`);
    }
  });


  return (
    <>
    <SpectrometerModal open={modal} refetch={refetch} handleClose={() => setModal(false)} spectrometer={spectrometer} />
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
        subheader={subheader}
        action={
          <Tooltip title="Spectrometer Information">
          <IconButton
            onClick={() => setModal(true)}
          >
            <Info />
          </IconButton>
          </Tooltip>

        }
        avatar={
          spectrometer && (
            <ConnectionStatus
              mutationStatus={connectSpectrometer}
              last_connected={spectrometer?.last_connected.$date}
            />
          )
        }
      />
      <CardContent>
        <CardActions>
          {spectrometer ? (
            <>
              {connectSpectrometer?.isLoading ? (
                <CircularProgress color="primary" size={30} thickness={6} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => connectSpectrometer.mutate(spectrometer?._id.$oid)}
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
    </>
  );
};

export default SpectrometerCard;


// Connection Status component for spectrometer cards


const ConnectionStatus = ({ mutationStatus, last_connected }: {mutationStatus: any, last_connected: number}) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    // Logic to handle if the spectrometer was connected to in the last 24 hours, and also set a last connected date in elapsed time
    if (last_connected) {
      const now = new Date();
      const last = new Date(last_connected);
      const diff = Math.abs(now.getTime() - last.getTime());
      const diffHours = Math.floor(diff / 1000 / 60 / 60);
      setElapsed(diffHours);
    }
  }, [last_connected]);

  function elapsedString() : string {
    if (elapsed < 1) {
      return 'less than an hour ago';
    } else if (elapsed === 1) {
      return '1 hour ago';
    } else {
      return `${elapsed} hours ago`;
    }
  }

  if (mutationStatus.isError) {
    return (
      <div>
        <Tooltip title="Failed Connection">
          <CancelRounded color="error" />
        </Tooltip>
      </div>
    );
  }

  if (mutationStatus.isSuccess) {
    return (
      <div>
        <Tooltip title="Connected">
          <CheckCircleRounded color="success" />
        </Tooltip>
      </div>
    );
  }

  if(last_connected && elapsed < 24) {
    return (
      <div>
        <Tooltip title={`Connected ${elapsedString()}`}>
          <CheckCircleRounded color="success" />
        </Tooltip>
      </div>
    );
  }
  return (
    <div>
      <Tooltip title="No Recent Connection Attempted">
        <WarningRounded color="warning" />
      </Tooltip>
    </div>
  );
};