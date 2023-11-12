import React from 'react';
import { NonUndefined } from 'react-hook-form';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Accessbility props for the tab panel
export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...rest } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}
