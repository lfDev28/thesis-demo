import type { TOption } from "../routes/automations/Automation";

type TOptionStatic = Omit<TOption, 'uniqueId'>;

export type TParamField = {
  value: number | string;
  type?: 'text' | 'number' | 'select';
  min?: number;
  max?: number;
  step?: number;
  optionsEndpoint?: string;
};

export type TParams = Record<string, TParamField>;

const automationOptions: TOptionStatic[] = [
    {
        id: 1,
      name: "Set voltage to _ volts",
      keyword: "SET_VOLTAGE",
      params: {
        "Voltage (V)": {
          value: 5,
          type: 'number',
          min: -10,
          max: 10,
          step: 0.1
        },
        "Compliance (mA)": {
          value: 1,
          type: 'number',
          min: 0,
          max: 10,
          step: 0.1
        },
      }
    },
    {
        id: 2,
      name: "Set current to _ mA",
      keyword: "SET_CURRENT",
      params: {
        "Current (mA)": {
          value: 5,
          type: 'number',
          min: 0,
          max: 10,
          step: 0.1
        }, 
        "Compliance (V)": {
          value: 10,
          type: 'number',
          min: -100,
          max: 100,
          step: 0.1
        },
      }
    },
    {
        id: 3,
      name: "Take EL Measurement",
      keyword: "EL_MEASUREMENT",
      params: {
        "Current (mA)": {
          value: 20,
          type: 'number',
          min: 0,
          max: 10,
          step: 0.1
        },
        "Compliance (V)": {
          value: 5,
          type: 'number',
          min: -100,
          max: 100,
          step: 0.1
        },
        "Integration Time (ms)": {
          value: 1000,
          type: 'number',
          min: 10,
          max: 1000,
          step: 10
        },
        "Scans to Average": {
          value: 1,
          type: 'number',
          min: 1,
          max: 10,
          step: 1
        },
          "Calibration": {
            type: "select",
            value: "65289e87e876410a175918de",
            optionsEndpoint: "/backend/calibration/"
          }
      }
    },
    {
        id: 4,
      name: "Perform IV Sweep",
      keyword: "IV_SWEEP",
      params: {
        "Start (V)": {
          value: -5,
          type: 'number',
          min: -10,
          max: 0,
          step: 0.1
        },
        "Stop (V)": {
          value: 5,
          type: 'number',
          min: 0,
          max: 10,
          step: 0.1
        },
        "Delay (s)": {
          value: 1,
          type: 'number',
          min: 0,
          max: 60,
          step: 1
        },
        "Points": {
          value: 50,
          type: 'number',
          min: 1,
          max: 100,
          step: 1
        },
        "Compliance (mA)": {
          value: 1,
          type: 'number',
          min: 0,
          max: 10,
          step: 0.1
        }
      }
    },
    {
      id: 5,
      name: "Add delay of _ seconds",
      keyword: "DELAY",
      params: {
        "Delay (s)": {
          value: 1,
          type: 'number',
          step: 1
        },
      },
    },
 
    {
        id: 7,
      name: "Repeat steps [x to y], _ times",
      keyword: "REPEAT_STEPS",
      params: {
        "Number of times": {
          value: 20,
          type: 'number',
          min: 1,
          max: 100,
          step: 1
        },
        "Step x": {
          value: 1,
          type: 'number',
          min: 1,
          max: 100,
          step: 1
        },
        "Step y": {
          value: 2,
          type: 'number',
          min: 1,
          max: 100,
          step: 1
        }
      }
    },
    {
        id: 8,
      name: "Repeat steps [x to y], _ times, with _ second delay between each step",
      keyword: "REPEAT_STEPS_DELAY",
      params: {
        "Number of times": {
          value: 5,
          type: 'number',
          min: 1,
          max: 100,
          step: 1
        },
        "Step x": {
          value: 1,
          type: 'number',
          min: 1,
          max: 100,
          step: 1
        },
        "Step y": {
          value: 2,
          type: 'number',
          min: 1,
          max: 100,
          step: 1
        },
        "Delay (s)": {
          value: 10,
          type: 'number',
          min: 1,
          max: 60,
          step: 1
        }
      }
    }
];

export default automationOptions;
