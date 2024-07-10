import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const VehiclePieChart = ({ myMap }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const cleanup = () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };

        if (chartRef.current && myMap) {
            cleanup();

            // Extracting keys and values from myMap object
            const keys = Object.keys(myMap);
            const values = Object.values(myMap);

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: keys,
                    datasets: [{
                        label: '',
                        data: values,
                        backgroundColor: ['red', 'blue', 'purple'],
                        borderWidth: 2,
                        borderColor: 'black'
                    }]
                },
                options: {
                    aspectRatio: 1,
                    cutout: 20
                }
            });
        }

        return cleanup;
    }, [myMap]);

    return (
        <div>
            <canvas ref={chartRef} style={{maxWidth: '300px', maxHeight: '300px', width: '100%', height: '100%'}}></canvas>
        </div>
    );
};

export default VehiclePieChart;
