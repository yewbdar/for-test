import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 30 },
];

const CustomBar = ({ data, onMouseEnter, onMouseLeave }) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
    onMouseEnter && onMouseEnter(data);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
    onMouseLeave && onMouseLeave();
  };

  return (
    <Bar
      data={data}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      fill={isHover ? '#8884d8' : '#82ca9d'}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const Chart = () => {
  const [tooltipData, setTooltipData] = useState(null);

  const handleBarMouseEnter = (data) => {
    setTooltipData(data);
  };

  const handleBarMouseLeave = () => {
    setTooltipData(null);
  };

  return (
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <CustomTooltip />
      <CustomBar onMouseEnter={handleBarMouseEnter} onMouseLeave={handleBarMouseLeave} />
    </BarChart>
  );
};

export default Chart;

