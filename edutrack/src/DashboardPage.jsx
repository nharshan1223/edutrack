import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './App.css'; // Import your updated CSS
import Header from './Header';
import Footer from './Footer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF69B4', '#5a0a9a']; // Colors for categories
const ASH_COLOR = '#E0E0E0'; // Color for unused time

function DashboardPage() {
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [longTermData, setLongTermData] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage
            try {
                const result = await axios.get('http://localhost:3001/tasks/get', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const tasks = result.data;
                setDailyData(calculateDailyPerformance(tasks));
                setWeeklyData(calculateWeeklyPerformance(tasks));
                setLongTermData(calculateLongTermPerformance(tasks));
            } catch (err) {
                console.error('Error fetching tasks:', err.response?.data || err.message);
            }
        };

        fetchTasks();
    }, []);

    const calculateDailyPerformance = (tasks) => {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const categoryTimes = {};
        const categories = ['study', 'projects', 'assignments', 'Lecture/Class/School Time', 'breaks', 'other'];
        categories.forEach(category => {
            categoryTimes[category] = 0;
        });

        tasks.forEach(task => {
            const taskStartTime = new Date(task.startTime);
            if (task.isCompleted && taskStartTime >= todayStart && taskStartTime < todayEnd) {
                const category = task.category;
                const timeSpent = task.elapsedTime;

                if (categories.includes(category)) {
                    categoryTimes[category] += timeSpent;
                } else {
                    categoryTimes['others'] += timeSpent; // Assign unrecognized categories to 'others'
                }
            }
        });

        const totalSpentTime = Object.values(categoryTimes).reduce((acc, time) => acc + time, 0);
        const totalAvailableTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        const dailyData = categories.map(category => ({
            name: category,
            value: categoryTimes[category] || 0
        }));

        const remainingTime = totalAvailableTime - totalSpentTime;
        if (remainingTime > 0) {
            dailyData.push({ name: 'Unused Time', value: remainingTime });
        }

        const totalValue = dailyData.reduce((acc, item) => acc + item.value, 0);
        if (totalValue === 0) {
            dailyData.push({ name: 'No Value', value: 1 });
        }

        return dailyData;
    };

    const calculateWeeklyPerformance = (tasks) => {
        const { weekStart, weekEnd } = getWeekRange();
        const categoryTimes = {};
        const categories = ['study', 'projects', 'assignments', 'Lecture/Class/School Time', 'breaks', 'other'];
        categories.forEach(category => {
            categoryTimes[category] = 0;
        });
    
        tasks.forEach(task => {
            const taskStartTime = new Date(task.startTime);
            if (task.isCompleted && taskStartTime >= weekStart && taskStartTime <= weekEnd) {
                const category = task.category;
                const timeSpent = task.elapsedTime;
    
                if (categories.includes(category)) {
                    categoryTimes[category] += timeSpent;
                } else {
                    categoryTimes['other'] += timeSpent; // Correct 'other' category assignment
                }
            }
        });
    
        const totalSpentTime = Object.values(categoryTimes).reduce((acc, time) => acc + time, 0);
        const totalAvailableTime = 24 * 60 * 60 * 1000 * 7; // 24 hours * 7 days in milliseconds
    
        const weeklyData = categories.map(category => ({
            name: category,
            value: categoryTimes[category] || 0
        }));
    
        const remainingTime = totalAvailableTime - totalSpentTime;
        if (remainingTime > 0) {
            weeklyData.push({ name: 'Unused Time', value: remainingTime });
        }
    
        // Ensure at least one data entry is present to avoid empty charts
        const totalValue = weeklyData.reduce((acc, item) => acc + item.value, 0);
        if (totalValue === 0) {
            weeklyData.push({ name: 'No Value', value: 1 });
        }
    
        return weeklyData;
    };
    

    const calculateLongTermPerformance = (tasks) => {
        const longTermTasks = tasks.filter(task => task.isLongTerm); // Assuming `isLongTerm` property
        const completedTasks = longTermTasks.filter(task => task.status === 'done').length;
        const totalTasks = longTermTasks.length;

        const data = [
            { name: 'Completed Tasks', value: completedTasks },
            { name: 'Remaining Tasks', value: totalTasks - completedTasks }
        ];

        return data;
    };

    const getWeekRange = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diffToMonday = (dayOfWeek + 6) % 7;

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - diffToMonday);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return { weekStart, weekEnd };
    };

    return (
        <div className='dashboard'>
            <Header />
            <div className='main-content'>
                <div className='short-term-performance'>
                    <h3>Short-Term Tasks Performance</h3>
                    <div className='pie-charts'>
                        <div className='pie-chart-section'>
                            <h4>Daily Performance</h4>
                            <div className='recharts-wrapper'>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={dailyData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dailyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Unused Time' ? ASH_COLOR : COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                        </div>
                        <div className='pie-chart-section'>
                            <h4>Weekly Performance</h4>
                            <div className='recharts-wrapper'>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={weeklyData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {weeklyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Unused Time' ? ASH_COLOR : COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='long-term-performance'>
                    <h3>Long-Term Tasks Performance</h3>
                    <div className='recharts-wrapper-doughnut'>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={longTermData}
                                cx="50%"
                                cy="50%"
                                innerRadius={100}
                                outerRadius={150}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {longTermData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DashboardPage;
