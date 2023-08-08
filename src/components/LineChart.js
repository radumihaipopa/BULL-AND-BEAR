import React, { memo} from 'react';
import '../styles/LineChart.css';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

const LineChart = ({ data }) => {
    const dates = data.map((item) => item[0]);
    const stopPrices = data.map((item) => item[4]);

    const chartData = {
        labels: dates,
        datasets: [
            {
                data: stopPrices,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    };

    // Configure chart options
    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                }
            },
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'nearest',
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        spanGaps: true,
        datasets: {
            maxPoints: 10, // Limit the number of visible data points
        },
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} />
        </div>
)};

export default memo(LineChart);