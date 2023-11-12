import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Transition from '../Layouts/ModalTransition';
import LoadingSpinner from '../main/LoadingSpinner';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller, FieldValues, Control } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { TSpectrometerData } from '../../App';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useToast, EToastTypes } from '../Context/ToastContext';

type TSpectrometerModal = {
  open: boolean;
  handleClose: () => void;
  spectrometer: TSpectrometerData;
  refetch: () => void;
};

const SpectrometerModal = ({
  open,
  handleClose,
  spectrometer,
  refetch,
}: TSpectrometerModal) => {
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { isDirty, isValid },
    reset,
  } = useForm();
  const { showTypedToast } = useToast();

  const [isEditMode, setIsEditMode] = useState(false);
  const [specState, setSpecState] = useState<TSpectrometerData>(spectrometer);

  const spectrometerMutation = useMutation({
    mutationKey: ['spectrometer-form'],
    mutationFn: async (data: TSpectrometerData) => {
      const res = await axios.patch(
        `/backend/spectrometer/${spectrometer._id.$oid}`,
        data
      );
      return res.data;
    },
    onError: (err: any) => {
      showTypedToast(EToastTypes.ERROR, String(err));
    },
    onSuccess: (data: TSpectrometerData) => {
      showTypedToast(
        EToastTypes.SUCCESS,
        'Successfully updated spectrometer information'
      );
      setSpecState(spectrometer);
      setIsEditMode(false);
      refetch();
    },
  });

  useEffect(() => {
    if (spectrometer && open) {
      setSpecState(spectrometer);
      reset(spectrometer); // reset the form with the spectrometer data when opened
    }
  }, [spectrometer, open]);

  const onSubmit = (data: TSpectrometerData) => {
    spectrometerMutation.mutate(data);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Spectrometer Information
        {!isEditMode && (
          <IconButton
            onClick={() => setIsEditMode(true)}
            style={{ float: 'right' }}
          >
            <Edit />
          </IconButton>
        )}
      </DialogTitle>

      {isEditMode ? (
        <SpectrometerForm
          control={control}
          spectrometer={spectrometer}
          onSubmit={onSubmit}
          register={register}
          setIsEditMode={setIsEditMode}
          handleSubmit={handleSubmit}
        />
      ) : (
        <SpectrometerInfo spectrometer={specState} />
      )}
    </Dialog>
  );
};

const SpectrometerForm = ({
  control,
  spectrometer,
  register,
  onSubmit,
  setIsEditMode,
  handleSubmit,
}: {
  control: Control<FieldValues, any>;
  spectrometer: TSpectrometerData;
  onSubmit: any;
  setIsEditMode: (val: boolean) => void;
  handleSubmit: any;
  register: any;
}) => {
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className="space-y-4">
            <Controller
              name="name"
              control={control}
              defaultValue={spectrometer.name}
              render={({ field }) => (
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="serial_number"
              control={control}
              defaultValue={spectrometer.serial_number}
              render={({ field }) => (
                <TextField
                  label="Serial Number"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="manufacturer"
              control={control}
              defaultValue={spectrometer.manufacturer}
              render={({ field }) => (
                <TextField
                  label="Manufacturer"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="model"
              control={control}
              defaultValue={spectrometer.model}
              render={({ field }) => (
                <TextField
                  label="Model"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="low_interpolation"
              control={control}
              defaultValue={spectrometer.low_interpolation}
              render={({ field }) => (
                <TextField
                {...register('low_interpolation', {
                  valueAsNumber: true,
                })
              } 
                  label="Low Interpolation"
                  type="number"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />

            <Controller
              name="high_interpolation"
              control={control}
              defaultValue={spectrometer.high_interpolation}
              render={({ field }) => (
                <TextField
                {...register('high_interpolation', {
                  valueAsNumber: true,
                })
                }
                  label="High Interpolation"
                  type="number"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />

            <Controller
              name="cal_integration_time"
              control={control}
              defaultValue={spectrometer.cal_intergration_time}
              render={({ field }) => (
                <TextField
                {...register('cal_intergration_time', {
                  valueAsNumber: true,
                })
                }
                  label="Calibration Integration Time"
                  type="number"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />

            <Controller
              name="cal_scans_to_average"
              control={control}
              defaultValue={spectrometer.cal_scans_to_average}
              render={({ field }) => (
                <TextField
                {...register('cal_scans_to_average', {
                  valueAsNumber: true,
                })
                }
                  label="Calibration Scans to Average"
                  type="number"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />

            <Controller
              name="aux_integration_time"
              control={control}
              defaultValue={spectrometer.aux_intergration_time}
              render={({ field }) => (
                <TextField
                {...register('aux_integration_time', {
                  valueAsNumber: true,
                })
                }
                  label="Auxiliary Integration Time"
                  type="number"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />

            <Controller
              name="aux_scans_to_average"
              control={control}
              defaultValue={spectrometer.aux_scans_to_average}
              render={({ field }) => (
                <TextField
                {...register('aux_scans_to_average', {
                  valueAsNumber: true,
                })
                }
                  label="Auxiliary Scans to Average"
                  type="number"
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              defaultValue={spectrometer.description}
              render={({ field }) => (
                <TextField
                
                  label="Description"
                  variant="outlined"
                  fullWidth
                  {...field}
                  multiline
                  rows={4}
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

import { Typography } from '@mui/material';

const SpectrometerInfo = ({
  spectrometer,
}: {
  spectrometer: TSpectrometerData;
}) => {
  return (
    <DialogContent>
      <Typography variant="body1" className="mb-1">
        <span className="text-gray-500 font-medium">Name:</span>{' '}
        {spectrometer.name}
      </Typography>

      <Typography variant="body1" className="mb-1">
        <span className="text-gray-500 font-medium">Serial Number:</span>{' '}
        {spectrometer.serial_number}
      </Typography>

      <Typography variant="body1" className="mb-1">
        <span className="text-gray-500 font-medium">Manufacturer:</span>{' '}
        {spectrometer.manufacturer}
      </Typography>

      <Typography variant="body1" className="mb-1">
        <span className="text-gray-500 font-medium">Model:</span>{' '}
        {spectrometer.model}
      </Typography>

      <Typography variant="body1" className="mt-3">
        <span className="text-gray-500 font-medium  mb-1">Description:</span>
        {spectrometer.description}
      </Typography>
    </DialogContent>
  );
};

export default SpectrometerModal;
