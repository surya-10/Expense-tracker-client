import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BarChart(){
    let allData = useSelector(state => state.chartDatareducer.data) || [];
    let [data, setData] = useState({
        labels: [],
        datasets: []
    });
    let [selectedCategory, setSelectedCategory] = useState("all");
    let [categories, setCategories] = useState([]);

    useEffect(() => {
        if (allData.length > 0) {
            let aggregatedData = aggregateExpensesByDayAndCategory(allData);
            let availableCategories = [...new Set(allData.map(expense => expense.category.toLowerCase()))];
            setCategories(availableCategories);
            updateChartData(aggregatedData, selectedCategory);
        }
    }, [allData, selectedCategory]);

    let aggregateExpensesByDayAndCategory = (expenses) => {
        let exp =  expenses.reduce((acc, expense) => {
            let date = expense.date.slice(0, 10);
            let category = expense.category.toLowerCase();
            if (!acc[date]) acc[date] = {};
            if (!acc[date][category]) acc[date][category] = 0;
            acc[date][category] += expense.amount;
            return acc;
        }, {});
        return exp;
    };

    let updateChartData = (aggregatedData, category) => {
        let labels = Object.keys(aggregatedData);
        let dataset = {
            label: category,
            data: labels.map(date => aggregatedData[date][category] || 0),
            backgroundColor: generateColors(1)[0] 
        };

        setData({
            labels,
            datasets: category === "all"
                ? Object.keys(aggregatedData[labels[0]] || {}).map(cat => ({
                    label: cat,
                    data: labels.map(date => aggregatedData[date][cat] || 0),
                    backgroundColor: generateColors(Object.keys(aggregatedData[labels[0]] || {}).length)
                }))
                : [dataset]
        });
    };

    let generateColors = (numColors) => {
        let colors = [];
        for (let i = 0; i < numColors; i++) {
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
        }
        return colors;
    };

    let handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <div>
            <h3>Daily Expenses by Category</h3>
            <div className='mb-3'>
                <label htmlFor='category-select'>Select Category: </label>
                <select id='category-select' onChange={handleCategoryChange} value={selectedCategory}>
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <Bar
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${tooltipItem.dataset.label}: $${tooltipItem.raw}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true
                        }
                    }
                }}
            />
        </div>
    );
};

export default BarChart;
