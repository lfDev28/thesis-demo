import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast, EToastTypes } from '../../components/Context/ToastContext';
import CustomLineChart from '../../components/main/CustomLineChart';
import LoadingSpinner from '../../components/main/LoadingSpinner';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

type TIVData = {
  name: string;
  description: string;
  start_time: {
    $date: number;
  }
  end_time: {
    $date: number;
  };
  status: string;
  participants: string[];
  metadata: Record<string, any>;
  voltages: number[];
  currents: number[];
};

type TFormValues = {
  name: string;
  description: string;
}

const IvExperiment = () => {
  const {id} = useParams();
  const { showTypedToast } = useToast();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<TFormValues>();
  const [editMode, setEditMode] = React.useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['iv', id],
    queryFn: async () => {
      const res = await axios.get(`/backend/smu/iv/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.data as TIVData;
    },
    onError: (error: any) => {
      showTypedToast(EToastTypes.ERROR, error?.message);
    },
    refetchInterval: (data) => {
      if(data?.status === "Running") {
        return 1500;
      } else {
        return false;
      }
    },
  });
  
  const updateExperiment = useMutation({
    mutationFn: async(params: {name: string, description: string}) => {
      const res = await axios.patch(`/backend/smu/iv/${id}`, params, {
        headers: {
          'Content-Type': 'application/json',
          },
        });
      return res.data as TIVData
    },
    onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, 'Experiment Updated');
      refetch();
      setEditMode(false);
    },
    onError: (error: Error) => {
      showTypedToast(EToastTypes.ERROR, error?.message);
    },
  });

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  // TODO: Fetch data from backend
  if (isLoading) return <LoadingSpinner />;

  if (isError) return <div>Error: {JSON.stringify(isError)}</div>;

  return (
    <Card className="p-10">
    
        {editMode ? (
          <form onSubmit={handleSubmit((data) => updateExperiment.mutate(data))}>
            <div className="space-y-2">
            <Controller
              name="name"
              control={control}
              defaultValue={data?.name}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...register('name')}
                  label="Experiment Name"
                  variant="outlined"
                  fullWidth
                  type="text"
                />
              )}
            />
            
            <Controller
              name="description"  
              control={control}
              defaultValue={data?.description}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...register('description')}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  type="text"
                />
              )}
            /></div>
            <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outlined"  onClick={handleEditClick}>Cancel</Button>
            <Button variant="contained" type="submit">Save</Button>
            </div>
          </form>
        ) : (
          <CardHeader title={data?.name} subheader={data?.description} action={
            <Tooltip title="Edit Details">
            <IconButton onClick={handleEditClick}>
              <Edit color='primary' />

            </IconButton></Tooltip>
          } />

        )}
    


    <CustomLineChart
      xAxis={data?.voltages}
      yAxis={data?.currents}
      metadata={data?.metadata}
      status={data?.status}
      title={`IV Sweep ${new Date(data?.start_time.$date).toLocaleString('en-AU')}`}
      xLabel="Voltage (V)"
      yLabel="Current (A)"
      seriesLabel="IV Data"
      />
      </Card>
  );
};

export default IvExperiment;
