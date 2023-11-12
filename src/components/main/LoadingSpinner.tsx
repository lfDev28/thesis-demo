import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
type Props = {};

const LoadingSpinner = (props: Props) => {
  return (
    <div className="flex justify-center items-center">
      <CircularProgress size={100} />
    </div>
  );
};

export default LoadingSpinner;
