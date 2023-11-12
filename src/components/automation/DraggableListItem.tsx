import React from 'react';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useDrag, useDrop } from 'react-dnd';
import automationOptions from '../../assets/AutomationOptions';
import { TOption } from '../../routes/automations/Automation';

type TDraggableListItemProps = {
  value: TOption;
  handleToggle: (value: TOption) => () => void;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  checked: readonly TOption[];
};

const ItemType = 'ITEM';

const DraggableListItem = ({
  value,
  handleToggle,
  index,
  moveItem,
  checked,
}: TDraggableListItemProps) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { type: string; index: number }) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const opacity = isDragging ? 0 : 1;

  const labelId = `transfer-list-all-item-${value?.id}-label`;

  return (
    <ListItem
      ref={ref}
      style={{ opacity, width: '100%', flex: 1 }}
      role="listitem"
      onClick={handleToggle(value)}
    >
      <ListItemIcon>
        <Checkbox
          checked={checked.indexOf(value) !== -1}
          tabIndex={-1}
          disableRipple
          inputProps={{
            'aria-labelledby': labelId,
          }}
        />
      </ListItemIcon>
      <ListItemText id={labelId} primary={value.name} />
    </ListItem>
  );
};

export default DraggableListItem;
