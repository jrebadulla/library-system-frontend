import React from "react";
import ReactApexChart from "react-apexcharts";
import "./Analytics.css";

const Analytics = () => {
    
  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1000,
      },
    },
    colors: ["#FF4560", "#775DD0"],
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["rgba(255, 69, 96, 0.8)", "rgba(119, 93, 208, 0.8)"],
      shadow: {
        enabled: true,
        color: "#000",
        top: 3,
        left: 3,
        blur: 5,
        opacity: 0.2,
      },
    },
    markers: {
      size: 5,
      colors: ["#FF4560", "#775DD0"],
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
      labels: {
        style: {
          colors: "#ffffff",
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
      title: {
        text: "Number of Books",
        style: {
          color: "maroon",
          fontSize: "14px",
        },
      },
      min: 0,
      max: 100,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      marker: {
        show: true,
        fillColors: ["#FF4560", "#775DD0"],
      },
    },
    legend: {
      position: "top",
      labels: {
        colors: ["#FF4560", "#775DD0"],
      },
      useSeriesColors: true,
    },
  };

  const chartData = [
    {
      name: "Borrowed Books",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 80],
    },
    {
      name: "Returned Books",
      data: [20, 29, 37, 36, 44, 45, 50, 58, 63],
    },
  ];

  return (
    <div className="analytics-container">
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="line"
        height={350}
      />
    </div>
  );
};

export default Analytics;
