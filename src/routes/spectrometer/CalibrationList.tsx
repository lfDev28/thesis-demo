import React from 'react';
import Card from '@mui/material/Card';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useModal } from '../../components/Context/ModalContext';
import { useToast, EToastTypes } from '../../components/Context/ToastContext';
import Visibility from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Add from '@mui/icons-material/Add';

const CalibrationList = () => {
  const { showTypedToast } = useToast();
  const { deleteModal } = useModal();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['cals'],

    queryFn: async () => {
      const res = await axios.get('/backend/calibration/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.data;
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Name',
      maxWidth: 300,
      flex: 1,
      renderCell: (params) => {
        //If the description doesnt fit on the line, we will render it in a tooltip
        if (params.value.length > 50) {
          return (
            <Tooltip title={params.value}>
              <Typography noWrap>{params.value}</Typography>
            </Tooltip>
          );
        }
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      type: 'date',
      valueFormatter: (params) => {
        return new Date(params?.value?.$date).toLocaleString('en-AU') || '';
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      maxWidth: 200,
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="space-x-2">
            <Tooltip title="Show Data">
              <Link
                to={{
                  pathname: `/calibration/${params.row._id.$oid}`,
                }}
              >
                <IconButton aria-label="view" size="small" color="primary">
                  <Visibility fontSize="inherit" />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Delete Experiment">
              <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={() =>
                  deleteModal(
                    handleDelete,
                    params.row._id.$oid,
                    `Are you sure you want to delete item "${
                      params.row.name || params.row._id.$oid
                    }"?`
                  )
                }
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const deleteCal = useMutation({
    mutationKey: ['delete_cal'],
    mutationFn: async (id: string) => {
      const res = await axios.delete(
        `/backend/calibration/${id}`);
      return res.data;
    },
    onError: (err) => {
      showTypedToast(EToastTypes.ERROR, JSON.stringify(err));
    },
    onSuccess: () => {
      showTypedToast(EToastTypes.SUCCESS, 'Successfully deleted EL Experiment');
      refetch();
    },
  });

  const newCalibration = useMutation({
    mutationKey: ['new_cal'],
    mutationFn: async () => {
      const res = await axios.post(`/backend/calibration/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    },
    onError: (err) => {
      showTypedToast(EToastTypes.ERROR, JSON.stringify(err));
    },
    onSuccess: (data) => {
      showTypedToast(
        EToastTypes.SUCCESS,
        'Successfully created new calibration'
      );
      navigate(`/calibration/${data._id.$oid}`)
        
    },
  });

  const handleDelete = (id: string) => {
    deleteCal.mutate(id);
  };

  return (
    <>
      <div className="flex justify-between pb-2">
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Calibration Data
        </Typography>
        <Tooltip title="Create new calibration">
          <Button
            variant="contained"
            onClick={() => newCalibration.mutate()}
            sx={{
              borderRadius: 4,
            }}
          >
            <Add />
          </Button>
        </Tooltip>
      </div>
      <Card>
        <DataGrid
          columns={columns}
          rows={data || []}
          loading={isLoading}
          sx={{
            height: 500,
            width: '100%',
          }}
          getRowId={(row) => row._id.$oid}
        />
      </Card>
    </>
  );
};

export default CalibrationList;
