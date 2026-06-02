import ApexCharts from "react-apexcharts";
const PieChart = ({ names, amounts }) => {
  const options = {
    series: amounts,
    chart: {
      width: 380,
      type: "pie",
    },
    labels: names,
    // theme: {
    //   mode: 'dark',
    //   palette: "palette1", // values from palette1 to palette10
    //   monochrome: {
    //     enabled: false,
    //   },
    // },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div id="chart">
      <ApexCharts
        options={options}
        series={options.series}
        type="pie"
        width={440}
      />
    </div>
  );
};

export default PieChart;
