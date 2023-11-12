import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { TOption } from '../../routes/automations/Automation';
import Transition from '../Layouts/ModalTransition';
import { CircularProgress } from '@mui/material';

type TAutomationModalProps = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  automationOptions: readonly TOption[];
  isLoading: boolean;
};

const AutomationModal = ({
  open,
  handleClose,
  handleSubmit,
  automationOptions,
  isLoading,
}: TAutomationModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Are you sure you want to begin this automation procedure?
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {automationOptions.map((option, index) => (
            <React.Fragment key={option.id}>
              <ListItem>
                <ListItemText primary={`Step ${index + 1}: ${option.name}`} />
              </ListItem>
              {option.params &&
                Object.keys(option.params).map((key) => (
                  <ListItem key={key} style={{ paddingLeft: 40 }}>
                    <ListItemText
                      secondary={`${key}: ${option.params[key].value}`}
                    />
                  </ListItem>
                ))}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CircularProgress size={30} /> : 'Run'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutomationModal;
