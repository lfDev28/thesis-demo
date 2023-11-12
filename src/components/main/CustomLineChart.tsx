import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
  LineOptions,
  PluginChartOptions,
} from 'chart.js';
import 'chartjs-plugin-zoom';
import Zoom from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import TimerRounded from '@mui/icons-material/TimerRounded';

// Status Icon component for the Line Chart
const StatusIcon = ({ status }: { status: string }) => {
  return (
    <>
      {status === 'Running' ? (
        <Tooltip title="Running">
          <TimerRounded color="primary" />
        </Tooltip>
      ) : status === 'Completed' ? (
        <Tooltip title="Completed">
          <CheckCircle color="success" />
        </Tooltip>
      ) : (
        <Tooltip title="Failed">
          <Cancel color="error" />
        </Tooltip>
      )}
    </>
  );
};

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Zoom
);

export type TLineChart = {
  xAxis: number[] | undefined;
  yAxis: number[] | undefined;
  title: string;
  xLabel?: string;
  yLabel?: string;
  metadata: Record<string, string> | undefined;
  seriesLabel?: string;
  status?: string;
};

const CustomLineChart = ({
  xAxis,
  yAxis,
  metadata,
  title,
  xLabel,
  yLabel,
  status,
  seriesLabel,
}: TLineChart) => {
  const [chartData, setChartData] = useState({
    labels: xAxis,
    datasets: [
      {
        label: seriesLabel,
        data: yAxis,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        spanGaps: true,
      },
    ],
  });
  const ref = useRef(null);

  const options = {
    type: 'line' as 'line',
    responsive: true,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        type: 'linear' as 'linear',
        ticks: {
          font: {
            size: 16,
          },
        },
        title: {
          display: true,
          text: xLabel,
          font: {
            size: 20,
          },
        },
      },
      y: {
        type: 'linear' as 'linear',
        ticks: {
          callback: function (value: any, index: any, values: any) {
            // Using E Notation if value is too large
            if (value >= 1000 || value <= -1000) {
              return Math.round(value).toExponential();
            } else {
              return Math.round(value);
            }
          },
          font: {
            size: 16,
          },
        },
        title: {
          display: true,
          text: yLabel,
          font: {
            size: 20,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (xDatapoint: any) => {
            return `X: ${xDatapoint[0].label}`;
          },
          label: (yDatapoint: any) => {
            return `Y: ${yDatapoint.raw}`;
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
        },
        pan: {
          enabled: true,
        },
      },
    },
  };

  useEffect(() => {
    // Sorting the x and y axis in parallel to ensure they remain in order.

    const sortedPairs =
      xAxis && yAxis
        ? xAxis.map((x, i) => ({ x, y: yAxis[i] })).sort((a, b) => a.x - b.x)
        : [];

    // Extract the sorted x and y values
    const sortedAndRoundedXAxis = sortedPairs.map((pair) =>
      Number(Math.round(pair.x * 100) / 100)
    );
    const sortedYAxis = sortedPairs.map((pair) => pair.y);

    setChartData({
      labels: sortedAndRoundedXAxis,
      datasets: [
        {
          label: seriesLabel,
          data: sortedYAxis,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          spanGaps: true,
        },
      ],
    });
  }, [xAxis, yAxis]);

  const resetZoom = () => {
    if (ref.current && ref) {
      const chartInstance: any = ref.current;
      chartInstance.resetZoom();
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        paddingBottom: 4,
      }}
    >
      <div>
        <div className="relative">
          <div className="absolute top-5 left-10 z-100">
            <StatusIcon status={status || ''} />
            <Tooltip title="Reset Zoom">
              <IconButton onClick={resetZoom}>
                <RefreshRounded />
              </IconButton>
            </Tooltip>
          </div>
          <Line data={chartData} options={options} ref={ref} />
        </div>

        <div className="space-x-2 flex-wrap flex justify-center items-center mt-4 gap-x-2 gap-y-4 ">
          {metadata &&
            Object.entries(metadata).map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                variant="filled"
                size="small"
                color="error"
              />
            ))}
        </div>
      </div>
    </Card>
  );
};

export default CustomLineChart;
