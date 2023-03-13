const showModalChange = (isShow) => {
    setShowModal(isShow)
    setSelectedInsightData({
      showModal: isShow,
      selectedInsight: '',
      selectedLowBal: ''
    })
  }




import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { showModalChange } from './your-file-name'

describe('showModalChange function', () => {
  it('should update the showModal state and setSelectedInsightData with the correct values', () => {
    const setShowModal = jest.fn()
    const setSelectedInsightData = jest.fn()

    showModalChange(true, setShowModal, setSelectedInsightData)

    expect(setShowModal).toHaveBeenCalledWith(true)
    expect(setSelectedInsightData).toHaveBeenCalledWith({
      showModal: true,
      selectedInsight: '',
      selectedLowBal: ''
    })
  })
})
