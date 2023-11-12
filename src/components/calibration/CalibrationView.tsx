import React from 'react';
import { TCalibrationById } from '../../routes/spectrometer/Calibration';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm, Controller } from 'react-hook-form';
import Edit from '@mui/icons-material/Edit';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import { useToast, EToastTypes } from '../Context/ToastContext';
import CalibrationChart from './CalibrationChart';


const steps = [0,1,2,3];

type TFormValues = {
  description: string;
};

const CalibrationView = ({
  calibration,
  refetch,
}: {
  calibration: TCalibrationById;
  refetch: () => void;
}) => {
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const { handleSubmit, control, register } = useForm<TFormValues>();
  const {showTypedToast} = useToast();


  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const updateMutation = useMutation({
    mutationKey: ['updateCal'],
    mutationFn: async (params: TCalibrationById) => {
      const res = await axios.patch(`/backend/calibration/${params._id.$oid}`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
    
      });
      return res.data;
    }, onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, 'Calibration Updated')
      refetch();
      setEditMode(false);
    },
    onError: (err) => {
      showTypedToast(EToastTypes.ERROR, "Failedto update calibration")
      setEditMode(false)
    }
  })

  return (
    <Card className="p-10">
      {editMode ? (
        <form
          onSubmit={handleSubmit((data) => {
            updateMutation.mutate({
              ...calibration,
              description: data.description,
            });
          })}
        >
          <Box className="space-y-2">
            <Controller
              name="description"
              control={control}
              defaultValue={calibration?.description}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...register('description')}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              )}
            />
          </Box>
          <Box className="flex justify-end space-x-2 pt-2">
            <Button variant="outlined" onClick={handleEditClick}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </form>
      ) : (
        <>
          <CardHeader
            title={calibration?.description}
            subheader={
              <div>
                <p>{`Status: ${calibration?.status}`}</p>
                <p>{`Created At: ${new Date(
                  calibration?.created_at.$date
                )?.toLocaleDateString('en-AU')}`}</p>
              </div>
            }
            action={
              <Tooltip title="Edit Details">
                <IconButton onClick={handleEditClick}>
                  <Edit color="primary" />
                </IconButton>
              </Tooltip>
            }
          />
          <Box className="p-4">
            {Object.entries(calibration.metadata).map(([key, value], index) => (
              <Chip
                key={index}
                label={`${key}: ${value}`}
                className="m-1"
                variant="filled"
                size="medium"
                color="error"
              />
            ))}
          </Box>
        </>
      )}
      {/* <div className="space-y-4"> */}
      {
        steps.map((step) => {
          return (
            <CalibrationChart step={step} data={calibration} />

          )
        })

      }
      {/* </div> */}

    </Card>
  );
};

export default CalibrationView;
