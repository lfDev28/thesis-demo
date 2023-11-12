import { Button } from '@mui/material';
import LoadingSpinner from '../../components/main/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

type TData = {
  id: number;
  isShutdown: boolean;
};

export const SmuMain = () => {
  const [fetch, setFetch] = useState(false);
  const {
    data: smuData,
    isLoading,
    error,
  }: any = useQuery({
    queryKey: ['smu'],
    queryFn: async () => {
      const res = await axios.get('/backend/smu/connect');
      return res.data as TData;
    },
    enabled: fetch,
  });

  if (isLoading && fetch) return <LoadingSpinner />;

  if (error) return <div>Error: {error.response.data.error}</div>;
  return (
    <>
      <ConnectPage setFetch={setFetch} />
      {smuData && (
        <>
          <div className="text-green-500">
            {smuData?.isShutdown ? 'SMU is shutdown' : 'SMU is running'}
          </div>
          <div>{JSON.stringify(smuData)}</div>
        </>
      )}
    </>
  );
};

export const ConnectPage = ({ setFetch }: any) => {
  return (
    <div className="flex justify-center items-center">
      <Button variant="contained" onClick={() => setFetch(true)}>
        Connect to SMU
      </Button>
    </div>
  );
};
