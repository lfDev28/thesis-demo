import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useToast, EToastTypes } from './components/Context/ToastContext';
import { useSmu } from './components/Context/SmuProvider';
import SmuCard from './components/devices/SmuCard';
import SpectrometerCard from './components/devices/SpectrometerCard';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Add from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import Refresh from '@mui/icons-material/Refresh';
import LoadingSpinner from './components/main/LoadingSpinner';
import McuCard from './components/devices/McuCard';
import { useMcu } from './components/Context/McuProvider';

export type TSpectrometerData = {
  name: string;
  description: string;
  serial_number: string;
  last_connected: {
    $date: number;
  };
  _id: {
    $oid: string;
  };
  model: string;
  manufacturer: string;
  low_interpolation: number;
  high_interpolation: number;
  cal_intergration_time: number;
  cal_scans_to_average: number;
  aux_intergration_time: number;
  aux_scans_to_average: number;
};

export type TSerialPortData = {
  device: string;
  name: string;
  description: string;
  hwid: string;
};

type TDashboardData = {
  spectrometers: TSpectrometerData[];
  serial_ports: TSerialPortData[];
  smu_ports: string[];
};

function App() {
  const { showTypedToast } = useToast();
  const { smu, handleSetSmuPort } = useSmu();
  const { mcu, handleSetMcuPort } = useMcu();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const res = await axios.get('/backend/devices/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data as TDashboardData;
    },
  });

  const connectSmu = useMutation({
    mutationKey: ['smuConnect'],
    mutationFn: async (port: string) => {
      const res = await axios.post('/backend/smu/connect', port);
      return res.data as any;
    },
    onError: (err: any) => {
      showTypedToast(EToastTypes.ERROR, err as string);
    },
    onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, 'SMU connected');
    },
  });

  const connectMcu = useMutation({
    mutationKey: ['mcuConnect'],
    mutationFn: async (port: string) => {
      const res = await new Promise((resolve) => setTimeout(resolve, 2000));
      return res;
    },
    onError: (err: any) => {
      showTypedToast(EToastTypes.ERROR, err as string);
    },
    onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, 'MCU connected');
    },
  });

  if (isError)
    return (
      <div>
        {JSON.stringify(error)}
      </div>
    );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h3" className="pb-4">
        Dashboard
      </Typography>
      <div className="space-y-2">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: 4,
                borderRadius: 4,
                width: '100%',
              }}
            >
              <CardHeader
                title="Devices"
                action={
                  <Tooltip title="Add new device">
                    <IconButton onClick={() => alert('Test')}>
                      <Add />
                    </IconButton>
                  </Tooltip>
                }
              />
              <hr />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6} xl={4}>
                    <SmuCard
                      handleChange={handleSetSmuPort}
                      device={smu}
                      header="SMU"
                      subheader="Choose the devices port from the list below"
                      isLoading={isLoading}
                      error={error}
                      devices={data?.smu_ports || []}
                      connectMutation={connectSmu}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} xl={4}>
                    <McuCard
                      handleChange={handleSetMcuPort}
                      device={mcu}
                      header="MCU"
                      subheader="Choose the devices port from the list below"
                      isLoading={isLoading}
                      error={error}
                      devices={data?.serial_ports || []}
                      connectMutation={connectMcu}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: 4,
                borderRadius: 4,
                width: '100%',
              }}
            >
              <CardHeader
                title="Spectrometers"
                action={
                  <Tooltip title="Refresh">
                    <IconButton onClick={() => alert('Test')}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                }
              />
              <hr />
              <CardContent>
                <Grid container spacing={2}>
                  {isLoading ? (
                    <Grid item xs={12}>
                      <LoadingSpinner />
                    </Grid>
                  ) : (
                    data?.spectrometers?.map((spectrometer) => (
                      <Grid item xs={12} md={6} lg={6} xl={4}>
                        <SpectrometerCard
                          refetch={refetch}
                          spectrometer={spectrometer}
                          header={spectrometer.name}
                          subheader={`Serial Number: ${spectrometer.serial_number}`}
                          isLoading={isLoading}
                          error={error}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

{
}
export default App;
