import React, { useEffect, useState } from 'react';
import Home from './Home';
import { useDispatch, useSelector } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Chart from './Chart';
import { getAllExpense } from '../redux/mySlice';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

function Visualize(){
    let token = localStorage.getItem("authToken");
    let allData = useSelector(state => state.chartDatareducer.data) || [];
    let loadingMsg = useSelector(state => state.chartDatareducer.msg);
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let userId = localStorage.getItem("userId");

    useEffect(() => {
        function verifyToken(){
            if(!token){
                alert("Login to view data");
                navigate("/login");
            }
        }
        async function getAllData() {
            let result = await fetch(`https://expense-tracker-server-h6sj.onrender.com/data/all/${userId}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "auth-token": `${token}`
                }
            });
            let resp = await result.json();
            if (resp.ok) {
                let data = resp.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                dispatch(getAllExpense(data));
            }
        }
        verifyToken();
        getAllData();
    }, [dispatch, token]);

    let [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Expenses by Category',
                data: [],
                backgroundColor: []
            },
        ],
    });

    useEffect(() => {
        if (allData.length > 0) {
            let categoryTotals = allData.reduce((acc, expense) => {
                let category = expense.category.toLowerCase();
                acc[category] = (acc[category] || 0) + expense.amount;
                return acc;
            }, {});

            let categories = Object.keys(categoryTotals);
            let colors = generateColors(categories.length);

            setData({
                labels: categories,
                datasets: [
                    {
                        label: 'Expenses by Category',
                        data: Object.values(categoryTotals),
                        backgroundColor: colors
                    },
                ],
            });
        }
    }, [allData]);

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

    return (
        <Home>
            <div className=' min-vh-100'>
                {allData.length === 0 ? (
                    <p className='h3'>{loadingMsg}</p>
                ) : (
                    <div className='vis-div' style={{maxWidth:"800px"}}>
                        <div className=''>
                            <Pie data={data} />
                        </div>
                        <div className='monthly-chart mt-5'>
                            <Chart />
                        </div>
                    </div>
                )}
            </div>
        </Home>
    );
};

export default Visualize;
