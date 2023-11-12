import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../../components/main/LoadingSpinner';
import { useToast, EToastTypes } from '../../components/Context/ToastContext';
import FileDropzone from '../../components/main/FileDropzone';
import 'chartjs-plugin-zoom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';



const ReadElFile = () => {
  const { showTypedToast } = useToast();

  const readFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/backend/spectrometer/el/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }, onError: (error: any) => {
      showTypedToast(EToastTypes.ERROR, error?.message);
    }, onSuccess: (data) => {
      showTypedToast(EToastTypes.SUCCESS, 'Successfully read file');
     
    }
  })

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
        <Card>
          <CardHeader
            title="Read EL File"
            subheader="Upload a .csv file containing EL data."
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
      
    </>
  );
};

export default ReadElFile;
