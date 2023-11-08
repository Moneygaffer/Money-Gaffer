import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import graphCSS from  './Graph.module.css';

const Graph = () => {
  const [show, setShow] = useState(true);

  const categories = ['Income', 'Expense', 'Savings', 'Investments', 'Insurances'];
  const data = [44, 55, 41, 17, 15];

  const options = {
    chart: {
      width: 380,
      type: 'donut',
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
              color: undefined,
              offsetY: 16,
            },
            total: {
              show: true,
              label: 'Total',
              color: '#000000',
              fontSize: '18px',
              fontFamily: 'Arial, sans-serif',
              offsetY: 0,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: function (val, opts) {
        return categories[opts.seriesIndex]  ;
      },
    },
    title: {
      text: 'Money Tracker',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div>
      <div id={graphCSS.chart}>
        {show && <ReactApexChart options={options} series={data} type="donut" width={380} />}
      </div>
     
    </div>
  );
};

export default Graph;