import React, { useEffect } from 'react';
import CalibrationStepper from '../../components/calibration/CalibrationStepper';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/main/LoadingSpinner';
import CalibrationView from '../../components/calibration/CalibrationView';
import { mockCalibration } from '../../assets/MockCalibration';

export type TCalibrationBySerial = {
  wavelengths: number[];
  dark_spectrum: number[];
  dark_aux_spectrum: number[];
  calibration_spectrum: number[];
  aux_calibration_spectrum: number[];
  aux_dut_spectrum: number[];
};

export const STATUS = {
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  IN_PROGRESS: 'In Progress',
  NOT_STARTED: 'Not Started',
} as const;

export type TCalibrationById = {
  _id: {
    $oid: string;
  };
  description: string;
  status: (typeof STATUS)[keyof typeof STATUS];
  created_at: {
    $date: number;
  };
  metadata: Record<string, any>;
  calibration_by_serial: Record<string, TCalibrationBySerial>;
};

const Calibration = () => {
  const { id } = useParams();

  if (!id) {
    return <div>Calibration ID not found</div>;
  }

  const {
    data: calibration,
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['calibration', id],
    queryFn: async () => {
      const res = await axios.get(`/backend/calibration/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.data as TCalibrationById;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error loading calibration</div>;
  }

  if (!calibration) {
    return <div>Calibration not found</div>;
  }

  if (
    calibration.status === STATUS.NOT_STARTED ||
    calibration.status === STATUS.IN_PROGRESS
  ) {
    return <CalibrationStepper calibration={calibration} refetch={refetch} />;
  }

  return <CalibrationView calibration={calibration} refetch={refetch} />;
};

export default Calibration;
