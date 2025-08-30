"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Plugin,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDonut({ byCategory }: { byCategory: Record<string, number> }) {
  const labels = Object.keys(byCategory);
  const values = Object.values(byCategory);
  const total = values.reduce((a, b) => a + b, 0);

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

  const data: ChartData<"doughnut"> = {
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

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          color: "#f3f4f6", // light gray
          font: {
            size: 14,
            weight: "bold",
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

  // ✅ Plugin to render total inside donut
  const centerText: Plugin<"doughnut"> = {
    id: "centerText",
    afterDraw(chart) {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;

      ctx.save();
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#f3f4f6"; // light gray text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`₹${total.toFixed(0)}`, width / 2, height / 2);
      ctx.restore();
    },
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-gray-900 rounded-lg">
      <div style={{ height: 300, width: 300 }}>
        <Doughnut data={data} options={options} plugins={[centerText]} />
      </div>
    </div>
  );
}
