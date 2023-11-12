import React from 'react'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import { TParamField } from '../../assets/AutomationOptions'
import MenuItem from '@mui/material/MenuItem'
import { TCalibrationData } from '../spectrometer/ElExperimentForm'
import getElapsedTime from '../../utils/getElapsedTime'


type TSelectOptionProps = {
    key: string;
    value: TParamField;
    onParamChange: (uniqueId: string, key: string, value: string | number) => void;
    uniqueId: string;
}   

const SelectOption = ({key, value, onParamChange, uniqueId}: TSelectOptionProps) => {

    const {data: selectOptions, isLoading, isError} = useQuery({
        queryKey: ['selectOptions'],
        queryFn: async () => {
            if(!value.optionsEndpoint) return []
            const res = await axios.get('/backend/calibration/')
            return res.data as TCalibrationData[]
        },
    })
    function renderCalibrationOption(calibrationData: TCalibrationData) {
        const description = calibrationData?.description || 'No description'; // Assuming metadata has a description. Modify as needed.
        return `${description.substring(0, 20)} - ${getElapsedTime(
          calibrationData.created_at.$date
        )}`;
      }



  return (
    <>
    <TextField 
        select
        fullWidth
        variant="outlined"
        label={key}
        disabled={isLoading || isError}
        value={value.value}
        onChange={e => onParamChange(uniqueId, key, e.target.value)}
        >
        {selectOptions?.map((option: any) => (
            <MenuItem key={option._id.$oid} value={option._id.$oid}>
                {renderCalibrationOption(option)}
            </MenuItem>
        ))}
           

        </TextField>
    </>
    
  )
}

export default SelectOption