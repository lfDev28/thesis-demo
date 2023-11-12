import HouseOutlined from "@mui/icons-material/HouseOutlined";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import ScienceOutlined from "@mui/icons-material/ScienceOutlined";
import PrecisionManufacturingOutlined from "@mui/icons-material/PrecisionManufacturingOutlined";
import PsychologyOutlined from "@mui/icons-material/PsychologyOutlined";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import HighlightOutlined from "@mui/icons-material/HighlightOutlined";
import TungstenOutlined from "@mui/icons-material/TungstenOutlined";

export const Routes = [
  {
    name: "Dashboard",
    Icon: HouseOutlined,
    link: "/",
  },
  {
        name: "Experiments",
        Icon: ScienceOutlined,
        items: [
          {
            name: "Run Experiment",
            Icon: PrecisionManufacturingOutlined,
            link: "/experiment",
            isChild: true,
          },
          {
            name: "Automation",
            Icon: PsychologyOutlined,
            link: "/experiment/automation",
            isChild: true,
          },
          {
            name: "IV Experiments",
            Icon: BoltOutlined,
            link: "/experiment/iv",
            isChild: true,
          },
          {
            name: "EL Experiments",
            Icon: HighlightOutlined,
            link: "/experiment/el",
            isChild: true,
          },
          {
            name: "Calibration",
            Icon: TungstenOutlined,
            link: "/calibration",
            isChild: true,
          },
        ],
      },
    {
      name: "Files",
      Icon: FolderOutlined,
      items: [
        {
          name: "IV Files",
          Icon: FileUploadOutlined,
          link: "/file-management/iv",
          isChild: true,
        },
        {
          name: "EL Files",
          Icon: FileUploadOutlined,
          link: "/file-management/el",
          isChild: true,
        },
      ],
    },
  
  ];
  