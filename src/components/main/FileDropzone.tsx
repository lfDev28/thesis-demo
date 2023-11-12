import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';

type TDropzone = {
  onDrop: (acceptedFiles: File[]) => void;
  onDropRejected: (fileRejections: FileRejection[], event: DropEvent) => void;
};

const FileDropzone = ({ onDrop, onDropRejected }: TDropzone) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        'text/csv': [],
      },
      onDrop,
      onDropRejected,
    });

  // Destructuring the root props to allow for onClick handler to only fire on button press
  const { onClick, ...rootProps } = getRootProps();

  return (
    <>
      <div
        {...rootProps}
        className="text-center p-20 border-2 border-dashed lg:w-3/5 sm: w-4/5 h-full  hover:border-blue-500 rounded-3xl "
      >
        <input className="input-zone" {...getInputProps()} />
        <div className="w-full">
          {isDragActive ? (
            <p className="">Release to drop the file here</p>
          ) : (
            <p>Drag n drop a CSV file, or click to browse files</p>
          )}
          <div className="pt-10">
            <Button
              onClick={onClick}
              variant="contained"
              sx={{
                borderRadius: 2,
              }}
            >
              Select File
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default FileDropzone;
