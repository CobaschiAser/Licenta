import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ParkingPieChart = ({requestNr, inputNr, outputNr}) => {
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
                    labels: ["Request", "Input To", "Output From"],
                    datasets: [{
                        label: '',
                        data: [requestNr, inputNr, outputNr],
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
    }, [requestNr, inputNr, outputNr]);

    return (
        <div>
            <canvas ref={chartRef} style={{maxWidth: '300px', maxHeight: '300px', width: '100%', height: '100%'}}></canvas>
        </div>
    );
};

export default ParkingPieChart;
