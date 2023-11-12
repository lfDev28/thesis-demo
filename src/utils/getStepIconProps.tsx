import { UseMutationResult } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';

const getStepIconProps = (
  stepIndex: number,
  activeStep: number,
  mutation: UseMutationResult<any, unknown, string, unknown>
) => {
  if (stepIndex === activeStep) {
    if (mutation?.isLoading) {
      // Handle loading state: You can use a loading spinner or other icons here
      return {
        icon: <CircularProgress size={30} />,
      };
    } else if (mutation?.isError) {
      // Handle error state
      return {
        icon: (
          <Close
            sx={{
              color: 'white',
              backgroundColor: 'error.main',
              borderRadius: '50%',
            }}
          />
        ),

        error: true,
      };
    }
    return {
      icon: stepIndex + 1,
      completed: false,
      error: false,
    };
  } else if (stepIndex < activeStep) {
    // If the step is before the active step, show it as completed
    return {
      icon: (
        <Done
          sx={{
            color: 'white',
            backgroundColor: 'primary.main',
            borderRadius: '50%',
          }}
        />
      ),
      completed: true,
      error: false,
    };
  } else {
    // Default state for future steps
    return {
      icon: stepIndex + 1,
    };
  }
};

export default getStepIconProps;
