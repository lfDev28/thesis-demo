import automationOptions from "../assets/AutomationOptions";
import { TOption } from "../routes/automations/Automation";
import { v4 as uuidv4 } from 'uuid';

export const options = automationOptions.map((options) => ({
    ...options,
    uniqueId: uuidv4(),
  }));

  const rightColumnData = localStorage.getItem('rightColumnData')
  const parsedRightColumnData = rightColumnData ? JSON.parse(rightColumnData) : null;
  const rightColummnData = Array.isArray(parsedRightColumnData) ? parsedRightColumnData : [];
  const currentParamsData = localStorage.getItem('currentParamsData')
  const parsedCurrentParamsData = currentParamsData ? JSON.parse(currentParamsData) : null;
  const currentParams = parsedCurrentParamsData ? parsedCurrentParamsData : {};

export type State = {
    anchorEl: null | HTMLElement;
    currentParams: TOption | null;
    paramValues: Record<string, any>;
    checked: readonly TOption[];
    left: readonly TOption[];
    right: readonly TOption[];
    modalOpen: boolean;
    email: string;
  };
  
  export const initialState: State = {
    anchorEl: null,
    currentParams: null,
    paramValues: currentParams,
    checked: [],
    left: options,
    right: rightColummnData,
    modalOpen: false,
    email: '',
  };
  
  
  export type Action =
    | { type: 'SET_ANCHOR_EL'; payload: HTMLElement | null }
    | { type: 'SET_CURRENT_PARAMS'; payload: TOption | null }
    | { type: 'SET_PARAM_VALUES'; payload: Record<string, any> }
    | { type: 'SET_CHECKED'; payload: readonly TOption[] }
    | { type: 'SET_LEFT'; payload: readonly TOption[] }
    | { type: 'SET_RIGHT'; payload: readonly TOption[] }
    | { type: 'TOGGLE_MODAL'; payload: boolean }
    | { type: 'SET_EMAIL'; payload: string };
  
  export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'SET_ANCHOR_EL':
        return { ...state, anchorEl: action.payload };
      case 'SET_CURRENT_PARAMS':
        return { ...state, currentParams: action.payload };
      case 'SET_PARAM_VALUES':
            localStorage.setItem('currentParamsData', JSON.stringify(action.payload));
            
            return { ...state, paramValues: action.payload };

      case 'SET_CHECKED':
        return { ...state, checked: action.payload };
      case 'SET_LEFT':
        return { ...state, left: action.payload };
      case 'SET_RIGHT':
        localStorage.setItem('rightColumnData', JSON.stringify(action.payload))
        return { ...state, right: action.payload };
      case 'TOGGLE_MODAL':
        return { ...state, modalOpen: action.payload };

      case 'SET_EMAIL':
        return { ...state, email: action.payload };


      default:
        return state;
    }
  };