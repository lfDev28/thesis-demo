import React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';
import { TParams } from '../../assets/AutomationOptions';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ParamsMenu from '../../components/automation/ParamsMenu';
import AutomationModal from '../../components/automation/AutomationModal';
import { useMutation } from '@tanstack/react-query';
import { useToast, EToastTypes } from '../../components/Context/ToastContext';
import { reducer, initialState } from '../../utils/automationReducer';
import { intersection, not, union } from '../../utils/automationHelpers';
import { useSmu } from '../../components/Context/SmuProvider';
import axios from 'axios';
import TextField from '@mui/material/TextField';

export type TOption = {
  id: number;
  name: string;
  keyword: string;
  uniqueId: string;
  params: TParams;
};


type TSubmitData = {
  data: readonly TOption[];
  email?: string;
}

const Automation = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { showTypedToast } = useToast();
  const { checkSmuPort } = useSmu();

  const leftChecked = intersection(state.checked, state.left);
  const rightChecked = intersection(state.checked, state.right);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: TOption
  ) => {
    event.stopPropagation();
    dispatch({ type: 'SET_CURRENT_PARAMS', payload: item });
    dispatch({ type: 'SET_ANCHOR_EL', payload: event.currentTarget });
  };

  const handleReset = () => {
    dispatch({ type: 'SET_RIGHT', payload: [] });
  };

  const handleClose = () => {
    dispatch({ type: 'SET_ANCHOR_EL', payload: null });
    dispatch({ type: 'SET_CURRENT_PARAMS', payload: null });
  };

  const handleToggle = (value: TOption) => () => {
    const currentIndex = state.checked.indexOf(value);
    const newChecked = [...state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    dispatch({ type: 'SET_CHECKED', payload: newChecked });
  };

  const numberOfChecked = (items: readonly TOption[]) =>
    intersection(state.checked, items)?.length;

  const handleToggleAll = (items: readonly TOption[]) => () => {
    if (numberOfChecked(items) === items.length) {
      dispatch({ type: 'SET_CHECKED', payload: not(state.checked, items) });
    } else {
      dispatch({ type: 'SET_CHECKED', payload: union(state.checked, items) });
    }
  };

  const handleCheckedRight = () => {
    const newLeftChecked = leftChecked.map((item) => ({
      ...item,
      uniqueId: uuidv4(), // generate a new uniqueId for each transferred item
    }));

    dispatch({
      type: 'SET_RIGHT',
      payload: [...state.right, ...newLeftChecked],
    });
    dispatch({ type: 'SET_CHECKED', payload: not(state.checked, leftChecked) });
  };

  const handleCheckedLeft = () => {
    dispatch({ type: 'SET_RIGHT', payload: not(state.right, rightChecked) });
    dispatch({
      type: 'SET_CHECKED',
      payload: not(state.checked, rightChecked),
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const itemsCopy = Array.from(state.right);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    dispatch({ type: 'SET_RIGHT', payload: itemsCopy });
  };

  const handleParamChange = (uniqueId: string, key: string, value: any) => {
    dispatch({
      type: 'SET_PARAM_VALUES',
      payload: {
        ...state.paramValues,
        uniqueId: uniqueId,
        [uniqueId]: { ...state.paramValues[uniqueId], [key]: value },
      },
    });
  };

  const runAutomation = useMutation({
    mutationFn: async (data: TSubmitData ) => {
      const res = await axios.post('/backend/automation/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },

    onError: (error: any) => {
      showTypedToast(
        EToastTypes.ERROR,
        'Failed to run automation' + String(error)
      );
    },
    onSuccess: () => {
      dispatch({ type: 'TOGGLE_MODAL', payload: false });
      showTypedToast(EToastTypes.SUCCESS, 'Successfully ran automation');
      localStorage.removeItem('rightColumnData');
      localStorage.removeItem('currentParamsData');
    },
  });

  const handleRunAutomation = (): void => {
    if (!checkSmuPort()) {
      return;
    }

    const submitData = {
      data: state.right,
      email: state.email,
    };

    
    runAutomation.mutate(state.right);
  };

  function renderLabel(
    name: string,
    side: 'LEFT' | 'RIGHT',
    index: number
  ): string {
    if (side === 'RIGHT') {
      return `${index + 1}. ${name}`;
    }
    return name;
  }

  const customList = (
    title: React.ReactNode,
    items: readonly TOption[],
    droppableId: string,
    side: 'LEFT' | 'RIGHT'
  ) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <List
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              width: '100%',
              height: '60vh',
              bgcolor: 'background.paper',
              overflow: 'auto',
            }}
            dense
            component="div"
            role="list"
          >
            {items.map((value: TOption, index: number) => (
              <Draggable
                key={value.uniqueId}
                draggableId={value.uniqueId}
                index={index}
              >
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    role="listitem"
                    onClick={handleToggle(value)}
                    sx={{ width: '100%' }}
                    divider
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={state.checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          'aria-labelledby': `transfer-list-all-item-${value.id}-label`,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={`transfer-list-all-item-${value.id}-label`}
                      primary={renderLabel(value.name, side, index)}
                      className="select-none"
                    />
                    {value.params && side === 'RIGHT' && (
                      <Tooltip title="Input Parameters">
                        <IconButton
                          aria-label="settings"
                          onClick={(e) => handleClick(e, value)}
                        >
                          <SettingsIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </Card>
  );

  return (
    <>
      <ParamsMenu
        anchorEl={state.anchorEl}
        handleClose={handleClose}
        currentParams={state.currentParams}
        paramValues={state.paramValues}
        handleParamChange={handleParamChange}
      />
      <AutomationModal
        open={state.modalOpen}
        handleClose={() => dispatch({ type: 'TOGGLE_MODAL', payload: false })}
        handleSubmit={handleRunAutomation}
        automationOptions={state.right}
        isLoading={runAutomation.isLoading}
      />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Typography variant="h6" sx={{}}>
          Automation
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Select the automation options you want to run and drag them to the
          order you want them to run in.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          If you would like to receive email notifications when the automation
          is finished or fails, place your email in the text box below.
        </Typography>
        <TextField
        sx={{
          mb:2,
        }}
          id="outlined-basic"
          label="Email"
          fullWidth
          variant="outlined"
          onChange={(e) => {
            dispatch({ type: 'SET_EMAIL', payload: e.target.value });
          }}
        />

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} md={5.5}>
            {customList('Options', state.left, uuidv4(), 'LEFT')}
          </Grid>
          <Grid item xs={12} sm={12} md={1}>
            <div className="flex flex-col items-center justify-center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                <Add />
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="remove select"
              >
                <Remove />
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={5.5}>
            {customList('Chosen', state.right, uuidv4(), 'RIGHT')}
          </Grid>
        </Grid>
        <div className="flex flex-row-reverse">
          <Button
            variant="contained"
            sx={{ mt: 2, ml: 2 }}
            onClick={() => {
              dispatch({ type: 'TOGGLE_MODAL', payload: true });
            }}
            disabled={state.right?.length === 0}
          >
            Run Automation
          </Button>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>
            Clear All
          </Button>
        </div>
      </DragDropContext>
    </>
  );
};

export default Automation;
