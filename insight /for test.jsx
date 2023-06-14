import { BarChart, Bar, Tooltip, Customized } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const bar = payload[0]; // Assuming you have a single bar in the chart
    const { x, y, width, height } = bar;
    const tooltipX = x + width / 2 - 15; // Adjusted with an offset of 15px

    return (
      <Customized x={tooltipX} y={y} width={0} height={0} zIndex={9999}>
        <div className="custom-tooltip">
          {/* Your tooltip content */}
        </div>
      </Customized>
    );
  }

  return null;
};

const YourBarChart = () => {
  return (
    <BarChart width={400} height={300} data={data}>
      <Bar dataKey="value" fill="#8884d8" />
      <Tooltip content={<CustomTooltip />} />
    </BarChart>
  );
};


