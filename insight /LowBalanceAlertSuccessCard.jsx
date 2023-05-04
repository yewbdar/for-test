import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomTooltip from './CustomTooltip';

describe('CustomTooltip', () => {
  it('renders tooltip correctly', () => {
    const props = {
      payload: [
        {
          payload: {
            month: 'January',
            value: 1000
          }
        }
      ]
    };

    render(<CustomTooltip {...props} />);

    const dateLabel = screen.getByText(/January/i);
    expect(dateLabel).toBeInTheDocument();

    const accountBalance = screen.getByText(/\$1,000/i);
    expect(accountBalance).toBeInTheDocument();
  });
});

