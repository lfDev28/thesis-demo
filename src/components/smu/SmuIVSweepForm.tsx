import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { useSmu } from '../Context/SmuProvider';

const SmuIVSweepForm = ({ mutation }: any) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();
  const { checkSmuPort } = useSmu();
  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (!checkSmuPort()) return;
        mutation.mutate({ data });
      })}
    >
      <Card
        sx={{
          borderRadius: 2,
        }}
      >
        <CardHeader
          title="IV Sweep"
          subheader="Input parameters for IV Sweep"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="Start (V)"
                control={control}
                defaultValue={-5}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Start (V)', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    required
                    fullWidth
                    label="Start (V)"
                    variant="outlined"
                    type="number"
                    inputProps={{ min: -5, max: 5, step: 0.01 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="Stop (V)"
                control={control}
                defaultValue={5}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Stop (V)', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    fullWidth
                    label="Stop (V)"
                    required
                    variant="outlined"
                    type="number"
                    inputProps={{ min: -5, max: 5, step: 0.01 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="Points"
                control={control}
                defaultValue={20}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Points', {
                      setValueAs: (value) => parseInt(value),
                    })}
                    error={!!errors.start}
                    required
                    fullWidth
                    label="Points"
                    variant="outlined"
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="Compliance (mA)"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Compliance (mA)', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    required
                    fullWidth
                    label="Compliance (mA)"
                    variant="outlined"
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="Delay (s)"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('Delay (s)', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    required
                    label="Delay (s)"
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained">
            Perform IV Sweep
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default SmuIVSweepForm;
