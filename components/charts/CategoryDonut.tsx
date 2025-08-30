"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDonut({ byCategory }: { byCategory: Record<string, number> }) {
  const labels = Object.keys(byCategory);
  const values = Object.values(byCategory);

  const palette: Record<string, string> = {
    Food: "#d62728",          // red
    Travel: "#1f77b4",        // blue
    Shopping: "#ff7f0e",      // orange
    Bills: "#2ca02c",         // green
    Health: "#9467bd",        // purple
    Entertainment: "#17becf", // teal
    Education: "#bcbd22",     // olive
    Other: "#7f7f7f",         // gray
  };

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((l) => palette[l] ?? "#9ca3af"),
        borderColor: "#1f2937", // gray-800 border to blend with dark bg
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          color: "#f3f4f6", // light gray
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      tooltip: {
        bodyColor: "#f9fafb", // white text
        titleColor: "#f9fafb",
        backgroundColor: "#111827", // dark tooltip bg
        borderColor: "#374151", // gray-700 border
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-gray-900 rounded-lg">
      <div style={{ height: 300, width: 300 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
