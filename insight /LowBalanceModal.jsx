// import React from 'react'
// import ErrorBoundary from '../ErrorBoundary'

// const LowBalanceModal = (props) => {
//   const LowBalAlertWidget = React.lazy(() => import('Insights/LowBalance'))
//   return (
//     <ErrorBoundary>
//       <LowBalAlertWidget {...props} />
//     </ErrorBoundary>
//   )
// }

// export { LowBalanceModal }





import React from 'react';
import { render, screen } from '@testing-library/react';
import { LowBalanceModal } from './LowBalanceModal';

jest.mock('Insights/LowBalance', () => {
  return {
    __esModule: true,
    default: ({ amount }) => (
      <div data-testid="low-balance-widget">
        Your balance is low: ${amount}
      </div>
    ),
  };
});

describe('LowBalanceModal', () => {
  test('renders the low balance widget with the given amount', async () => {
    render(<LowBalanceModal amount={100} />);

    const widget = await screen.findByTestId('low-balance-widget');
    expect(widget).toHaveTextContent('Your balance is low: $100');
  });
});
