import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './App.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function DashboardPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => {
                const tasks = result.data;
                const dailyData = calculateDailyPerformance(tasks);
                setData(dailyData);
            })
            .catch(err => console.log(err));
    }, []);

    const calculateDailyPerformance = (tasks) => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const categoryTimes = {};

        tasks.forEach(task => {
            if (task.isCompleted && new Date(task.startTime).toISOString().split('T')[0] === today) {
                const category = task.category;
                const timeSpent = task.elapsedTime;
                
                if (!categoryTimes[category]) {
                    categoryTimes[category] = 0;
                }
                categoryTimes[category] += timeSpent;
            }
        });

        return Object.keys(categoryTimes).map(category => ({
            name: category,
            value: categoryTimes[category]
        }));
    };

    return (
        <div className='dashboard'>
            <h2>Daily Performance</h2>
            <PieChart width={800} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

export default DashboardPage;
