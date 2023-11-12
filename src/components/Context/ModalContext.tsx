import React, { createContext, useState, useContext, ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Transition from '../Layouts/ModalTransition';

interface IModalProviderProps {
  children: ReactNode;
}

interface IModalContext {
  deleteModal: (
    deleteFunction: (id: string) => void,
    id: string,
    message?: string
  ) => void;
}

export const ModalContext = createContext<IModalContext>({
  deleteModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export default function ModalProvider({ children }: IModalProviderProps) {
  const [open, setOpen] = useState(false);
  const [deleteFunction, setDeleteFunction] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string>('');
  // Default title set - can be changed by calling setTitle
  const [title, setTitle] = useState<string>(
    'Are you sure you want to delete this item?'
  );

  const deleteModal = (
    deleteFunction: (id: string) => void,
    id: string,
    message?: string
  ) => {
    setDeleteFunction(() => deleteFunction);
    setDeleteId(id);
    if (message) {
      setTitle(message);
    } else {
      setTitle(`Are you sure you want to delete item #${id}?`);
    }
    setOpen(true);
  };

  const handleDelete = () => {
    deleteFunction(deleteId);
    setOpen(false);
  };

  const handleClose = () => {
    setDeleteFunction(null);
    setOpen(false);
  };

  return (
    <ModalContext.Provider value={{ deleteModal }}>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {children}
    </ModalContext.Provider>
  );
}
