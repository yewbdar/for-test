const handleButtonClick = (action, nivData) => {
    if (action?.storyModal && action?.url) {
      if (SMBLowBalanceConstants?.includes(nivData?.insightId)) {
        handleInsightEvent(nivData?.insightId, nivData?.customID)
      }
    }
}