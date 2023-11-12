import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TCalibrationFormProps } from './CalibrationStepper';

const DarkForm = ({ mutation, cal_id, has_data }: TCalibrationFormProps) => {
  return (
    <Card sx={{ mt: 2, padding: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Measure Darks
      </Typography>
      <Typography paragraph>
        Open the lid and mount the NIST-calibrated lamp on the entrance port of
        the integrating sphere. Do not power on the lamp. Click the button below
        to measure darks.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => mutation?.mutate(cal_id)}
        disabled={mutation?.isLoading}
      >
        Measure Dark
      </Button>
    </Card>
  );
};

export default DarkForm;
