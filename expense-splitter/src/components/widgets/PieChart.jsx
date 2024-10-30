import { useEffect, useRef } from "react";

export default function PieChart({ label, pieData }) {
  // Create reference to dom elements
  const chartRef = useRef(null);

  const labels = Object.keys(pieData);
  const data = Object.values(pieData);

  useEffect(() => {
    const dataPie = {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: [
            "#05299e",
            "#761699",
            "#af008b",
            "#d80076",
            "#f4235d",
            "#ff5344",
            "#ffa600",
          ],
          hoverOffset: 4,
        },
      ],
    };

    const configPie = {
      type: "doughnut",
      data: dataPie,
      options: {
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 15,
              },
            },
          },
        },
      },
    };

    const pieChart = new Chart(chartRef.current, configPie);

    // Cleanup the chart on component unmount
    return () => {
      pieChart.destroy();
    };
  });

  return (
    <div className="mx-auto aspect-square max-w-sm overflow-hidden lg:max-w-lg">
      <canvas className="p-4" ref={chartRef}></canvas>
    </div>
  );
}
