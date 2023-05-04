
        import React from 'react';
import { render, screen } from '@testing-library/react';
import _USBPersoneticsBarChart from './_USBPersoneticsBarChart';

describe('_USBPersoneticsBarChart', () => {
  const block = {
    categories: ['Category 1', 'Category 2'],
    series: [
      { value: 10, indicator: 20 },
      { value: 30, indicator: 40 },
    ],
  };
  const plotLines = { value: 15 };
  const chartHeight = 300;

  it('should render a USBReBarChart component with no data if block.series.length is 0', () => {
    render(
      <_USBPersoneticsBarChart
        block={{ series: [], categories: [] }}
        plotLines={plotLines}
        chartHeight={chartHeight}
      />
    );

    const chart = screen.getByTestId('usb-re-bar-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute('data-no-data', 'true');
  });

  it('should render a USBReBarChart component with data if block.series.length is greater than 0', () => {
    render(
      <_USBPersoneticsBarChart
        block={block}
        plotLines={plotLines}
        chartHeight={chartHeight}
      />
    );

    const chart = screen.getByTestId('usb-re-bar-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute('data-no-data', 'false');
    expect(chart).toHaveAttribute('data-x-axis', JSON.stringify({ categories: ['Category 1', 'Category 2'] }));
    expect(chart).toHaveAttribute('data-y-axis', JSON.stringify({ plotLines: [{ value: 15 }] }));
    expect(chart).toHaveAttribute('data-series', JSON.stringify([{ y: 10 }, { y: 30 }]));
  });

  it('should round the values to the nearest integer if indicatorValue is false', () => {
    render(
      <_USBPersoneticsBarChart
        block={block}
        plotLines={plotLines}
        chartHeight={chartHeight}
        indicatorValue={false}
      />
    );

    const chart = screen.getByTestId('usb-re-bar-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute('data-series', JSON.stringify([{ y: 10 }, { y: 30 }]));
  });

  it('should round the indicator values to the nearest integer if indicatorValue is true', () => {
    render(
      <_USBPersoneticsBarChart
        block={block}
        plotLines={plotLines}
        chartHeight={chartHeight}
        indicatorValue={true}
      />
    );

    const chart = screen.getByTestId('usb-re-bar-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute('data-series', JSON.stringify([{ y: 20 }, { y: 40 }]));
  });
});
