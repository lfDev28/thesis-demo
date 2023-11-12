import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../../components/main/LoadingSpinner';
import { useToast, EToastTypes } from '../../components/Context/ToastContext';
import CustomLineChart from '../../components/main/CustomLineChart';
import SmuIVSweepForm from '../../components/smu/SmuIVSweepForm';
import { TIVData } from '../iv/ReadIVFile';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../../components/main/TabPanel';
import { a11yProps } from '../../components/main/TabPanel';
import { useNavigate } from 'react-router-dom';
import ElExperimentForm from '../../components/spectrometer/ElExperimentForm';
import Grid from '@mui/material/Grid';

export type TIVSweepParams = {
  start: number;
  stop: number;
  step: number;
  delay: number;
  port: string;
};

export type TElParams = {
  current: number;
  integration_time: number;
  scans_to_average: number;
};

type TReturnData = {
  id: string;
};

const RunExperiment = () => {
  const { showTypedToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const performSweep = useMutation({
    mutationFn: async (params: TIVSweepParams) => {
      const res = await axios.post('/backend/smu/iv/do_sweep_db', params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data as TReturnData;
    },
    onError: () => {
      showTypedToast(EToastTypes.ERROR, 'IV Sweep Failed');
    },
    onSuccess: (data) => {
      showTypedToast(EToastTypes.SUCCESS, 'IV Sweep Started');

      navigate(`/experiment/iv/${data.id}`);
    },
  });

  const performEl = useMutation({
    mutationFn: async (params: TElParams) => {
      const res = await axios.post(
        '/backend/spectrometer/el/do_el_experiment',
        params,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return res.data as TReturnData;
    },
    onError: () => {
      showTypedToast(EToastTypes.ERROR, 'EL Experiment Failed');
    },
    onSuccess: (data) => {
      showTypedToast(EToastTypes.SUCCESS, 'EL Experiment Started');
      navigate(`/experiment/el/${data?.id}`);
    },
  });

  if (performSweep.isLoading) return <LoadingSpinner />;

  if (performSweep.isError)
    return <div>Error: {JSON.stringify(performSweep.error)}</div>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6}>
        <SmuIVSweepForm mutation={performSweep} />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <ElExperimentForm mutation={performEl} />
      </Grid>
    </Grid>
  );
};

export default RunExperiment;
