import { useForm, Controller, FieldValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TElParams } from '../../routes/smu/RunExperiment';
import IconButton from '@mui/material/IconButton';
import { ReactElement } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import CreateNewFolderRounded from '@mui/icons-material/CreateNewFolderRounded';
import Tooltip from '@mui/material/Tooltip';
import { useToast, EToastTypes } from '../Context/ToastContext';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import generateMockCalibrations from '../../assets/MockCalibration';
import getElapsedTime from '../../utils/getElapsedTime';
import { useSmu } from '../Context/SmuProvider';

type TCalibrationBySerial = {
  wavelengths: number[];
  dark_spectrum: number[];
  dark_aux_spectrum: number[];
  calibration_spectrum: number[];
  aux_calibration_spectrum: number[];
  aux_dut_spectrum: number[];
};

export type TCalibrationData = {
  _id: {
    $oid: string;
  };
  created_at: {
    $date: number;
  };
  description: string;
  metadata: Record<string, string>;
  calibration_by_serial: Record<string, TCalibrationBySerial>;
};

const ElExperimentForm = ({ mutation }: any) => {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm();


  // Watches for changes in the calibration form
  const isCalibrationChecked = watch('calibration', false) as boolean;

  const { checkSmuPort } = useSmu();
  const { showTypedToast } = useToast();

  const {
    data: calibration,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['calibration'],
    queryFn: async () => {


      const res = await axios.get('/backend/calibration/');

      return res.data as TCalibrationData[];
    },
  });

  function renderCalibrationOption(calibrationData: TCalibrationData) {
    const description = calibrationData?.description || 'No description'; // Assuming metadata has a description. Modify as needed.
    return `${description.substring(0, 20)} - ${getElapsedTime(
      calibrationData.created_at.$date
    )}`;
  }

  function submitHandler(data: FieldValues) {
    if (!isCalibrationChecked) {
      return showTypedToast(
        EToastTypes.WARNING,
        'Please select a calibration file'
      );
    } else if (!checkSmuPort()) {
      return;
    } else mutation.mutate({ data });
  }

  return (
    <form onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Card
        sx={{
          borderRadius: 2,
        }}
      >
        <CardHeader
          title="EL Experiment"
          subheader="Input parameters for EL Experiment"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="Current (mA)"
                control={control}
                defaultValue={10}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Current (mA)', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    required
                    fullWidth
                    label="Current (mA)"
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 1, max: 100, step: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="Integration Time (ms)"
                control={control}
                defaultValue={100}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Integration Time (ms)', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    fullWidth
                    label="Integration Time (ms)"
                    required
                    variant="outlined"
                    type="number"
                    inputProps={{ step: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="Scans"
                control={control}
                defaultValue={2}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Scans', {
                      setValueAs: (value) => parseInt(value),
                    })}
                    error={!!errors.start}
                    required
                    fullWidth
                    label="Scans"
                    variant="outlined"
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={10}>
              <Controller
                name="calibration"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    variant="outlined"
                    label="Calibration"
                    disabled={isLoading || !calibration || isError}
                  >
                    {calibration?.map((calibrationData) => (
                      <MenuItem
                        key={calibrationData._id.$oid}
                        value={calibrationData._id.$oid}
                      >
                        {renderCalibrationOption(calibrationData)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Link to="/calibration">
                <Tooltip title="Create a new calibration">
                  <IconButton size="large">
                    <CreateNewFolderRounded />
                  </IconButton>
                </Tooltip>
              </Link>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            disabled={!isCalibrationChecked || isLoading}
          >
            Run EL Experiment
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default ElExperimentForm;
