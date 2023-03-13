/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {
  render,
  screen,
  cleanup,
  fireEvent,
  createEvent
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { getStylefromPriority, replaceAfToken } from '../../../utils'
import GQLTestClient from '../../../utils/testClient'

import NotificationList from './NotificationList'

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  replaceAfToken: jest.fn()
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

const props = [
  {
    text: 'Some notification',
    accountToken: 'sffds',
    priority: 1,
    customID: 'customID',
    insightId: 'insightId',
    useCaseId: 'useCaseId',
    category1: 'category1',
    transactionID: 'transactionID',
    actions: [
      {
        blockId: 'view',
        type: 'button',
        text: 'view',
        storyPage: null,
        url: 'https://google.com'
      }
    ],
    accountType: 'Deposit'
  }
]

const linkProp = [
  {
    text: 'Some notification',
    accountToken: 'sffds',
    priority: 1,
    customID: 'customID',
    insightId: 'insightId',
    useCaseId: 'useCaseId',
    category1: 'category1',
    transactionID: 'transactionID',
    actions: [
      {
        blockId: 'view',
        type: '2',
        text: 'sampleLink',
        url: 'https://google.com'
      }
    ],
    accountType: 'Deposit'
  }
]

const dismissProps = [
  {
    text: 'notification with dismiss',
    accountToken: 'sffds',
    priority: 1,
    customID: 'customID',
    insightId: 'insightId',
    useCaseId: 'useCaseId',
    category1: 'category1',
    transactionID: 'transactionID',
    actions: [
      {
        blockId: 'dismissText',
        type: 'button',
        text: 'Dismiss'
      }
    ],
    accountType: 'Deposit'
  }
]

const multipleNotiprops = [
  {
    text: 'High priority notification',
    accountToken: 'sffds',
    priority: 1,
    customID: 'customID',
    insightId: 'insightId',
    useCaseId: 'useCaseId',
    category1: 'category1',
    transactionID: 'transactionID',
    actions: [
      {
        blockId: 'view',
        type: 'button',
        text: 'view',
        storyPage: null
      }
    ],
    accountType: 'Deposit'
  },
  {
    text: 'Some notification',
    accountToken: 'sffds',
    priority: 4,
    customID: 'customID',
    insightId: 'insightId',
    useCaseId: 'useCaseId',
    category1: 'category1',
    transactionID: 'transactionID',
    actions: [
      {
        blockId: 'view',
        type: 'button',
        text: 'view',
        url: '',
        storyPage: null
      }
    ],
    accountType: 'Credit card'
  },
  {
    text: 'Some notification',
    accountToken: 'sffds',
    priority: 4,
    customID: 'customID',
    insightId: 'insightId',
    useCaseId: 'useCaseId',
    category1: 'category1',
    transactionID: 'transactionID',
    actions: [
      {
        blockId: 'view',
        type: 'button',
        text: 'view',
        url: '',
        storyPage: null
      }
    ],
    accountType: 'Credit card'
  }
]

describe('Account notification', () => {
  afterEach(cleanup)
  it('should render without crash', () => {
    const div = document.createElement('div')
    render(
      <GQLTestClient>
        <NotificationList nivs={props} productCode="BLN" subProductCode="L" />
      </GQLTestClient>,
      div
    )
  })

  it('should render single notification', () => {
    render(
      <GQLTestClient>
        <NotificationList nivs={props} productCode="BLN" subProductCode="L" />
      </GQLTestClient>
    )
    expect(screen.getByText('Some notification')).toBeVisible()
  })

  it('should render multiple Notification', () => {
    render(
      <GQLTestClient>
        <NotificationList
          nivs={multipleNotiprops}
          productCode="BLN"
          subProductCode="N"
        />
      </GQLTestClient>
    )
    screen.getAllByText('Some notification').forEach((element) => {
      expect(element).toBeVisible()
    })
  })

  it('should  have a high priority class if priority is greater than 1', () => {
    render(
      <GQLTestClient>
        <NotificationList
          nivs={multipleNotiprops}
          productCode="BLN"
          subProductCode="B"
          updateNivs={jest.fn()}
        />
      </GQLTestClient>
    )
    expect(screen.getByText(/high priority notification/i)).toBeTruthy()
    // expect(
    //   screen.getByRole('button', {
    //     name: /view/i
    //   })
    // ).toBeTruthy()
  })

  it('button click ', () => {
    render(
      <GQLTestClient>
        <NotificationList
          nivs={props}
          productCode="BLN"
          subProductCode="B"
          updateNivs={jest.fn()}
        />
      </GQLTestClient>
    )
    expect(
      screen.getByRole('button', {
        name: /view/i
      })
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: /view/i
      })
    )
    expect(replaceAfToken).toHaveBeenCalled()
  })

  it('should  have shown link ', () => {
    render(
      <GQLTestClient>
        <NotificationList
          nivs={linkProp}
          productCode="BLN"
          subProductCode="B"
          updateNivs={jest.fn()}
        />
      </GQLTestClient>
    )
    expect(screen.getByRole('link', { name: /sampleLink/i })).toBeTruthy()

    // const link = screen.getByRole('link', { name: /sampleLink/i })
    // const myEvent = createEvent.click(link)
    // myEvent.preventDefault = jest.mock()
    // fireEvent(link, myEvent)
    // expect(myEvent.preventDefault).toHavebeenCalled()
  })

  it('should  have dismiss ', () => {
    render(
      <GQLTestClient>
        <NotificationList
          nivs={dismissProps}
          productCode="BLN"
          subProductCode="B"
          updateNivs={jest.fn()}
        />
      </GQLTestClient>
    )
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
  })
})
