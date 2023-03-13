const showModalChange = (isShow) => {
    setShowModal(isShow)
    setSelectedInsightData({
      showModal: isShow,
      selectedInsight: '',
      selectedLowBal: ''
    })
  }