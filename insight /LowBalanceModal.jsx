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
import { render, fireEvent } from '@testing-library/react';

describe('handleInsightEvent function', () => {
  it('should call handleInsightEvent with correct parameters when SMBLowBalanceConstants includes insightId', () => {
    const SMBLowBalanceConstants = ['insight1', 'insight2'];
    const nivData = { insightId: 'insight1', customID: 'custom1' };
    const handleInsightEvent = jest.fn();

    render(
      <button onClick={() => {
        if (SMBLowBalanceConstants?.includes(nivData?.insightId)) {
          handleInsightEvent(nivData?.insightId, nivData?.customID)
        }
      }}>Test button</button>
    );

    fireEvent.click(screen.getByText('Test button'));

    expect(handleInsightEvent).toHaveBeenCalledTimes(1);
    expect(handleInsightEvent).toHaveBeenCalledWith(nivData?.insightId, nivData?.customID);
  });

  it('should not call handleInsightEvent when SMBLowBalanceConstants does not include insightId', () => {
    const SMBLowBalanceConstants = ['insight1', 'insight2'];
    const nivData = { insightId: 'insight3', customID: 'custom1' };
    const handleInsightEvent = jest.fn();

    render(
      <button onClick={() => {
        if (SMBLowBalanceConstants?.includes(nivData?.insightId)) {
          handleInsightEvent(nivData?.insightId, nivData?.customID)
        }
      }}>Test button</button>
    );

    fireEvent.click(screen.getByText('Test button'));

    expect(handleInsightEvent).not.toHaveBeenCalled();
  });
});

