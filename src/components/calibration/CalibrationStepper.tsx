import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DarkForm from '../../components/calibration/DarkForm';
import CalForm from '../../components/calibration/CalForm';
import AuxCalForm from '../../components/calibration/AuxCalForm';
import AuxDutForm from '../../components/calibration/AuxDutForm';
import Button from '@mui/material/Button';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import getStepIconProps from '../../utils/getStepIconProps';
import {
  TCalibrationById,
  TCalibrationBySerial,
} from '../../routes/spectrometer/Calibration';
import { useMcu } from '../Context/McuProvider';
import axios from 'axios';
import { useToast, EToastTypes } from '../Context/ToastContext';
import CalibrationChart from './CalibrationChart';
import { TLineChart } from '../main/CustomLineChart';

export type TCalibrationFormProps = {
  mutation?: UseMutationResult<any, unknown, string, unknown>;
  lampMutation?: UseMutationResult<any, unknown, boolean, unknown>;
  cal_id: string;
  has_data?: boolean;
};

const CalibrationStepper = ({
  calibration,
  refetch,
}: {
  calibration: TCalibrationById;
  refetch: () => void;
}) => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const { checkMcuPort } = useMcu();
  const { showTypedToast } = useToast();

  const darkMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.post(`/backend/calibration/${id}/dark-spectrum`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    },
    onError: (error) => {
      showTypedToast(EToastTypes.ERROR, 'Failed to measure darks');
    },
    onSuccess: () => {
      refetch();
      showTypedToast(EToastTypes.SUCCESS, 'Darks measured');
    },
  });

  const calMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.post(
        `/backend/calibration/${id}/calibration-spectrum`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    },
    onError: (error) => {
      showTypedToast(EToastTypes.ERROR, 'Failed to measure cal');
    },
    onSuccess: () => {
      refetch();
      showTypedToast(EToastTypes.SUCCESS, 'Cal measured');
    },
  });

  const auxCalMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.post(
        `/backend/calibration/${id}/aux-calibration-spectrum`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    },
    onError: (error) => {
      showTypedToast(EToastTypes.ERROR, 'Failed to measure aux cal');
    },
    onSuccess: () => {
      refetch();
      showTypedToast(EToastTypes.SUCCESS, 'Aux Cal measured');
    },
  });

  const auxDutMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.post(
        `/backend/calibration/${id}/aux-dut-spectrum`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    },
    onError: (error) => {
      showTypedToast(EToastTypes.ERROR, 'Failed to measure aux dut');
    },
    onSuccess: () => {
      refetch();
      showTypedToast(EToastTypes.SUCCESS, 'Aux DUT measured');
    },
  });

  const lampMutation = useMutation({
    mutationFn: async (state: boolean) => {
      const res = await axios.post(`/backend/calibration/calibration-lamp`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          state,
        },
      });
      return res.data;
    },
    onError: (error) => {
      showTypedToast(EToastTypes.ERROR, 'Failed to toggle lamp');
    },
    onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, 'Lamp toggled');
    },
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      label: 'Measure Darks',
      component: (props: TCalibrationFormProps) => <DarkForm {...props} />,
    },
    {
      label: 'Measure Cal',
      component: (props: TCalibrationFormProps) => <CalForm {...props} />,
    },
    {
      label: 'Aux + Cal',
      component: (props: TCalibrationFormProps) => (
        <AuxCalForm {...props} lampMutation={lampMutation} />
      ),
    },
    {
      label: 'Aux + DUT',
      component: (props: TCalibrationFormProps) => (
        <AuxDutForm {...props} lampMutation={lampMutation} />
      ),
    },
  ];

  const mutationMap: Record<
    number,
    UseMutationResult<any, unknown, string, unknown>
  > = {
    0: darkMutation,
    1: calMutation,
    2: auxCalMutation,
    3: auxDutMutation,
  };

  React.useEffect(() => {
    let stepToSet = 0;
    for (let i = 0; i < steps.length; i++) {
      if (!doesStepHaveData(i)) {
        console.log(i);
        stepToSet = i;
        break;
      }
    }
    setActiveStep(stepToSet);
  }, [calibration]);

  const doesStepHaveData = (step: number): boolean => {
    if (!calibration || !calibration.calibration_by_serial) {
      return false;
    }

    return Object.keys(calibration.calibration_by_serial).some((serial) => {
      const calibrationData = calibration.calibration_by_serial[serial];

      switch (step) {
        case 0:
          return (
            calibrationData.dark_spectrum &&
            calibrationData.dark_spectrum.length > 0
          );
        case 1:
          return (
            calibrationData.calibration_spectrum &&
            calibrationData.calibration_spectrum.length > 0
          );
        case 2:
          return (
            calibrationData.aux_calibration_spectrum &&
            calibrationData.aux_calibration_spectrum.length > 0
          );
        case 3:
          return (
            calibrationData.aux_dut_spectrum &&
            calibrationData.aux_dut_spectrum.length > 0
          );
        default:
          return false;
      }
    });
  };

  function handleDisabledButton(): boolean {
    return activeStep === steps?.length - 1 || mutationMap[activeStep]?.isError;
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconProps={getStepIconProps(
                  index,
                  activeStep,
                  mutationMap[index]
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {activeStep === steps.length - 1 ? (
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>Next</Button>
            </Box>
          )}
        </Box>
      </Box>
      {steps[activeStep]?.component({
        mutation: mutationMap[activeStep],
        cal_id: calibration?._id?.$oid,
        has_data: doesStepHaveData(activeStep),
      })}

      <div className="pt-10 space-y-4">

        <CalibrationChart step={activeStep} data={calibration} />
      </div>
    </>
  );
};

export default CalibrationStepper;
