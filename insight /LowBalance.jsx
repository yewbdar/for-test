
       import React from 'react';
import { shallow } from 'enzyme';
import _USBPersoneticsBarChart from './_USBPersoneticsBarChart';
import USBReBarChart from './ReChart/USBReBarChart';

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
    const wrapper = shallow(
      <_USBPersoneticsBarChart
        block={{ series: [], categories: [] }}
        plotLines={plotLines}
        chartHeight={chartHeight}
      />
    );

    expect(wrapper.find(USBReBarChart)).toHaveLength(1);
    expect(wrapper.find(USBReBarChart).props().noData).toBe(true);
  });

  it('should render a USBReBarChart component with data if block.series.length is greater than 0', () => {
    const wrapper = shallow(
      <_USBPersoneticsBarChart
        block={block}
        plotLines={plotLines}
        chartHeight={chartHeight}
      />
    );

    expect(wrapper.find(USBReBarChart)).toHaveLength(1);
    expect(wrapper.find(USBReBarChart).props().noData).toBe(false);
    expect(wrapper.find(USBReBarChart).props().xAxis).toEqual({ categories: ['Category 1', 'Category 2'] });
    expect(wrapper.find(USBReBarChart).props().yAxis).toEqual({ plotLines: [{ value: 15 }] });
    expect(wrapper.find(USBReBarChart).props().data).toEqual([
      { y: 10 },
      { y: 30 },
    ]);
  });

  it('should round the values to the nearest integer if indicatorValue is false', () => {
    const wrapper = shallow(
      <_USBPersoneticsBarChart
        block={block}
        plotLines={plotLines}
        chartHeight={chartHeight}
        indicatorValue={false}
      />
    );

    expect(wrapper.find(USBReBarChart).props().data).toEqual([
      { y: 10 },
      { y: 30 },
    ]);
  });

  it('should round the indicator values to the nearest integer if indicatorValue is true', () => {
    const wrapper = shallow(
      <_USBPersoneticsBarChart
        block={block}
        plotLines={plotLines}
        chartHeight={chartHeight}
        indicatorValue={true}
      />
    );

    expect(wrapper.find(USBReBarChart).props().data).toEqual([
      { y: 20 },
      { y: 40 },
    ]);
  });
});
