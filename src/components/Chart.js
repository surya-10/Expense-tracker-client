import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import BarChart from './DailyChart';
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

function Chart() {
    let allData = useSelector(state => state.chartDatareducer.data);

    let monthlyTotals = allData.reduce((acc, expense) => {
        let month = dayjs(expense.date).format('YYYY-MM');
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
    }, {});

    let sortedMonths = Object.keys(monthlyTotals).sort();
    let data = {
        labels: sortedMonths,
        datasets: [
            {
                label: 'Monthly Expenses',
                data: sortedMonths.map(month => monthlyTotals[month]),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    return (
        <div>
            <div>
                <h3>Monthly Expenses: All category</h3>
                <Line data={data} />
            </div>
            <div>
                <p>Daily expenses</p>
                <BarChart />
            </div>
        </div>

    );
};

export default Chart;
