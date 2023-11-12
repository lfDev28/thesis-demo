import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TCalibrationFormProps } from './CalibrationStepper';
import Card  from '@mui/material/Card';

const CalForm = ({ mutation, cal_id, has_data }: TCalibrationFormProps) => {
  return (
    <Card sx={{ mt: 2, padding: 3, border: '1px solid #ddd', borderRadius: 2,  }}>
      <Typography variant="h6" gutterBottom>
        Measure Cal
      </Typography>
      <Typography paragraph>
        Turn on the lamp and allow it to stabilize for 10 minutes.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => mutation?.mutate(cal_id)}
        disabled={mutation?.isLoading}
      >
        Measure Cal
      </Button>
    </Card>
  );
};

export default CalForm;
