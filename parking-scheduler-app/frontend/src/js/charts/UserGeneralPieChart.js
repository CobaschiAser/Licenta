import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const UserGeneralChartComponent = ({totalUser, periodUser, type}) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const cleanup = () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };

        if (chartRef.current) {
            cleanup();
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [type === 'period' ? 'Total users registered' : 'Total users registered in period', type === 'period' ? 'User registered in selected period' : 'Active users in period'],
                    datasets: [{
                        label: '',
                        data: [totalUser , periodUser],
                        backgroundColor: ['red', 'blue'],
                        borderWidth: 1
                    }]
                },
                options: {
                    aspectRatio: 1,
                    cutout: 20
                }
            });
        }

        return cleanup;
    }, [totalUser, periodUser, type]);

    return (
        <div>
            <canvas ref={chartRef} style={{maxWidth: '300px', maxHeight: '300px', width: '100%', height: '100%'}}></canvas>
        </div>
    );
};

export default UserGeneralChartComponent;
