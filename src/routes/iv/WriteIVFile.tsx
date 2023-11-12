import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../../components/main/LoadingSpinner';
import { useToast, EToastTypes } from '../../components/Context/ToastContext';
import FileDropzone from '../../components/main/FileDropzone';
import CustomLineChart from '../../components/main/CustomLineChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel, { a11yProps } from '../../components/main/TabPanel';

export type TIVData = {
  metadata: Array<Record<string, string>>;
  voltages: number[];
  currents: number[];
};

const WriteIVFile = () => {
  const { showTypedToast } = useToast();
  const [tab, setTab] = useState(0);

  const readFile = useMutation({
    mutationKey: ['readFile'],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/backend/smu/iv/write_file_to_db', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as any;
    },
    onError: (error: any) => {
      showTypedToast(EToastTypes.ERROR, error?.message);
    },
    onSuccess: (data) => {
      showTypedToast(EToastTypes.SUCCESS, 'Successfully read file');
    },
  });


  // On Drop callback for the file dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the dropped files here
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      readFile.mutate(file);
    } else {
      showTypedToast(EToastTypes.ERROR, 'No file was dropped.');
    }
  }, []);

  // Rendering the loading spinner if the file is being read
  if (readFile.isLoading) return <LoadingSpinner />;
  // Rendering the error message if the file could not be read
  if (readFile.isError) return <div>Error: {readFile.error}</div>;

  return (
    <>
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          paddingBottom: 4,
        }}
      >
        <Tab value={0} label="File Upload" {...a11yProps(0)} />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Card
          sx={{
            borderRadius: 2,
          }}
        >
          <CardHeader
            title="Write .csv file to database"
            subheader="Upload a .csv file containing IV data."
          />
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <FileDropzone
              onDrop={onDrop}
              onDropRejected={() => {
                showTypedToast(EToastTypes.ERROR, 'File type not supported');
              }}
            />
          </CardContent>
        </Card>
      </TabPanel>
    </>
  );
};

export default WriteIVFile;
