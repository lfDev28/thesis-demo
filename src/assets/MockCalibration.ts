import { TCalibrationById } from "../routes/spectrometer/Calibration";


export const STATUS = {
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    IN_PROGRESS: 'In Progress',
    NOT_STARTED: 'Not Started',
  } as const;

export const mockCalibration: TCalibrationById = {
    _id: {
        $oid: "1234567890abcdef"
    },
    description: "Calibration for Spectrometer XYZ",
    status: STATUS.COMPLETED,
    created_at: {
      $date: Date.now()
    },
    metadata: {
      "Model": "XYZ-1000",
      "Operator": "John Doe",
      "Location": "Lab A",
      "Ambient Temperature": "22°C",
      "Software Version": "1.0.5"
    },
    calibration_by_serial: {
      "ABC123": {
        wavelengths: [400, 450, 500, 550, 600, 650, 700],
        dark_spectrum: [0.01, 0.02, 0.015, 0.017, 0.02, 0.025, 0.03],
        dark_aux_spectrum: [0.015, 0.022, 0.018, 0.02, 0.024, 0.027, 0.031],
        calibration_spectrum: [1.5, 1.6, 1.7, 1.65, 1.63, 1.62, 1.61],
        aux_calibration_spectrum: [1.55, 1.62, 1.71, 1.67, 1.64, 1.63, 1.6],
        aux_dut_spectrum: [1.56, 1.61, 1.68, 1.66, 1.63, 1.62, 1.59],
      },
      "DEF456": {
        wavelengths: [400, 450, 500, 550, 600, 650, 700],
        dark_spectrum: [0.015, 0.02, 0.018, 0.019, 0.021, 0.025, 0.03],
        dark_aux_spectrum: [0.016, 0.022, 0.02, 0.021, 0.023, 0.027, 0.031],
        calibration_spectrum: [1.53, 1.59, 1.7, 1.66, 1.62, 1.61, 1.6],
        aux_calibration_spectrum: [1.54, 1.61, 1.68, 1.67, 1.64, 1.61, 1.6],
        aux_dut_spectrum: [1.52, 1.6, 1.67, 1.66, 1.63, 1.6, 1.59],
      }
    }
  };

  export default function generateMockCalibrations(amount: number): TCalibrationById[] {
    const statuses = Object.values(STATUS);
    
    function getRandomStatus() {
      return statuses[Math.floor(Math.random() * statuses.length)];
    }
  
    function getRandomCalibrationBySerial() {
      return {
        wavelengths: [400, 450, 500, 550, 600, 650, 700],
        dark_spectrum: [0.01 + Math.random() * 0.02, 0.02 + Math.random() * 0.02, 0.015 + Math.random() * 0.02, 0.017 + Math.random() * 0.02, 0.02 + Math.random() * 0.02, 0.025 + Math.random() * 0.02, 0.03 + Math.random() * 0.02],
        dark_aux_spectrum: [0.015 + Math.random() * 0.02, 0.022 + Math.random() * 0.02, 0.018 + Math.random() * 0.02, 0.02 + Math.random() * 0.02, 0.024 + Math.random() * 0.02, 0.027 + Math.random() * 0.02, 0.031 + Math.random() * 0.02],
        calibration_spectrum: [1.5 + Math.random(), 1.6 + Math.random(), 1.7 + Math.random(), 1.65 + Math.random(), 1.63 + Math.random(), 1.62 + Math.random(), 1.61 + Math.random()],
        aux_calibration_spectrum: [1.55 + Math.random(), 1.62 + Math.random(), 1.71 + Math.random(), 1.67 + Math.random(), 1.64 + Math.random(), 1.63 + Math.random(), 1.6 + Math.random()],
        aux_dut_spectrum: [1.56 + Math.random(), 1.61 + Math.random(), 1.68 + Math.random(), 1.66 + Math.random(), 1.63 + Math.random(), 1.62 + Math.random(), 1.59 + Math.random()],
      };
    }
  
    const mockCalibrations: TCalibrationById[] = [];
  
    for (let i = 0; i < amount; i++) {
      const calibration: TCalibrationById = {
        _id: {
            $oid: `1234567890abcdef${i}`
        },
        description: `Calibration ${i} for Spectrometer XYZ`,
        status: getRandomStatus(),
        created_at: {
          $date: Date.now()
        },
        metadata: {
          "Model": `XYZ-${i}`,
          "Operator": `Operator ${i}`,
          "Location": `Lab ${String.fromCharCode(65 + i)}`,
          "Ambient Temperature": `${22 + i}°C`,
          "Software Version": `1.0.${i}`
        },
        calibration_by_serial: {
          [`ABC${123 + i}`]: getRandomCalibrationBySerial(),
          [`DEF${456 + i}`]: getRandomCalibrationBySerial(),
        }
      };
  
      mockCalibrations.push(calibration);
    }
  
    return mockCalibrations;
  }
  
  
  