// import React, { useState, useRef, useEffect, useContext } from 'react'
// import Logger from '@usb-ui-tools/logger'
// import { USBColumn } from '@usb-shield/react-grid'
// import { useManualQuery, ClientContext } from 'graphql-hooks'
// import USBLink from '@usb-shield/react-link'
// import USBButton from '@usb-shield/react-button'
// import { USBIconInfo, USBIconWarning } from '@usb-shield/react-icons'
// import { SEND_NOTIFICATION_STATUS } from '../../../graphql/insightsQuery'
// import {
//   getStylefromPriority,
//   replaceAfToken,
//   makeObjNivSelected
// } from '../../../utils'
// import { updateInsightsEvents } from '../../../utils/loggerError'
// import {
//   DISABLED_NIVS_KEY,
//   stepName,
//   SMBLowBalanceConstants
// } from '../../../utils/constants'
// import StoryPageModal from '../StoryPage/StoryPageModal'
// import Grid from '../../atoms/Grid'
// import { tealiumEvent } from '../../../utils/tealiumGenerator'
// import { getLocale } from '../../../utils/aem'
// import { SPANISH_FULL_CODE, ENGLISH_FULL_CODE } from '../../../constants'
// import { getSessionStorageItem } from '../../../utils/jsUtils/index'
// import { useInView } from '../../../hooks/useInView'

// import { LowBalanceFeedBack, LowBalanceModal } from '../LowBalanceAlert'
// import './styles.scss'

// const NotificationList = ({
//   nivs,
//   id,
//   updateNivs,
//   accountLastDigit,
//   accountName
// }) => {
//   const client = useContext(ClientContext)
//   const [showModal, setShowModal] = useState(false)
//   const [selectedInsightData, setSelectedInsightData] = useState({
//     showModal: false,
//     selectedInsight: '',
//     selectedLowBal: ''
//   })
//   const showModalChange = (isShow) => {
//     setShowModal(isShow)
//     setSelectedInsightData({
//       showModal: isShow,
//       selectedInsight: '',
//       selectedLowBal: ''
//     })
//   }
//   const [sendInsightsAction] = useManualQuery(SEND_NOTIFICATION_STATUS)
//   function appendToDisabledNivs(item) {
//     const disabledNivs =
//       JSON.parse(sessionStorage.getItem(DISABLED_NIVS_KEY)) ?? []
//     disabledNivs.push(item)
//     sessionStorage.setItem(DISABLED_NIVS_KEY, JSON.stringify(disabledNivs))
//   }

//   const teaserElementRef = useRef()
//   const isVisible = useInView(teaserElementRef)
//   const [isTeaserViewed, setisTeaserViewed] = useState(false)

//   useEffect(() => {
//     if (isVisible && !isTeaserViewed) {
//       setisTeaserViewed(true)
//       /* eslint-disable-next-line */
//       nivs?.forEach((item) => {
//         const languageType =
//           getLocale() === 'en-us' ? ENGLISH_FULL_CODE : SPANISH_FULL_CODE
//         const insightStatus = 'insight viewed'
//         const locationPrefix = 'cust_dash'
//         const zoneLocation = 'acctalert'
//         const customerTypeCode =
//           getSessionStorageItem('customerTypeCode') || 'R'
//         const eventDetails = {
//           siteSection: 'customer dashboard',
//           subSiteSection: `insight`,
//           channel: window?.appNameForSiteCat,
//           deviceType: window?.uxNameForSiteCat,
//           sitePlatform: 'omni',
//           insightUseCaseId: `${locationPrefix}_${item?.useCaseId}:${zoneLocation}`,
//           languageType,
//           onClickEvent: `omni:customer dashboard:${insightStatus}`,
//           customerSegment: `customer type ${
//             customerTypeCode?.toLowerCase() || 'r'
//           }`,
//           productCode: getSessionStorageItem('productCodeListForTealium') || '',
//           transactionStatus: insightStatus
//         }
//         tealiumEvent(eventDetails, 'onClick')
//       })
//     }
//   }, [isVisible])

//   function dissmissNIVHandler(matchID) {
//     Logger.info({
//       // @ts-ignore
//       eventSource: {
//         businessCapability: 'SMB_ACCOUNT_LIST',
//         businessFunctionality: 'SMB_ACCOUNT_LISTING_NIV_DISMISS',
//         component: 'ACCOUNT_LISTING',
//         stepName: stepName.nivDismissal
//       },
//       eventStatus: 'INFO'
//     })
//     const tempArr = [...nivs]
//     const index = tempArr.findIndex((niv) => niv.customID === matchID)
//     tempArr.splice(index, 1)
//     updateNivs(tempArr)
//     appendToDisabledNivs(matchID)

//     /**
//      * Personetics Update
//      *  updating the dismiss action in the personetics so that
//      *  the insights should not come on next reload.
//      */
//     sendInsightsAction({
//       variables: {
//         input: JSON.stringify({
//           settings: {
//             insightsTag: {
//               [matchID]: { preferenceType: 'hide' }
//             }
//           },
//           type: 'setInsightPreferences',
//           deviceType: 'ios',
//           ctxId: 'dashboard',
//           lang: 'en',
//           protocolVersion: '2.5'
//         })
//       }
//     })
//   }

//   const handleInsightEvent = async (insightId, instanceId) => {
//     // @ts-ignore
//     const { url, headers } = client
//     await updateInsightsEvents(
//       { url, headers },
//       makeObjNivSelected({
//         insightId,
//         instanceId
//       })
//     )
//   }
//   const handleButtonClick = (action, nivData) => {
//     if (action?.storyModal && action?.url) {
//       if (SMBLowBalanceConstants?.includes(nivData?.insightId)) {
//         handleInsightEvent(nivData?.insightId, nivData?.customID)
//       }
//     }

//     const languageType =
//       getLocale() === 'en-us' ? ENGLISH_FULL_CODE : SPANISH_FULL_CODE
//     let insightStatus = 'insight dismiss clicked'
//     const locationPrefix = 'cust_dash'
//     const zoneLocation = 'acctalert'
//     const customerTypeCode = getSessionStorageItem('customerTypeCode') || 'R'
//     let eventDetails
//     if (action.text === 'Add alert') {
//       insightStatus = 'insight clicked'
//       eventDetails = {
//         siteSection: 'customer dashboard',
//         subSiteSection: `insight:${zoneLocation}`,
//         channel: window?.appNameForSiteCat,
//         deviceType: window?.uxNameForSiteCat,
//         sitePlatform: 'omni',
//         insightUseCaseId: `${locationPrefix}_${nivData?.useCaseId}`,
//         languageType,
//         onClickEvent: `omni:customer dashboard:${insightStatus}`,
//         customerSegment: `customer type ${
//           customerTypeCode?.toLowerCase() || 'r'
//         }`,
//         productCode: getSessionStorageItem('productCodeListForTealium') || '',
//         transactionStatus: insightStatus
//       }
//       tealiumEvent(eventDetails, 'onClick')
//     }

//     if (!action.storyModal && !action.url) {
//       if (action?.text === 'Dismiss') {
//         eventDetails = {
//           siteSection: 'customer dashboard',
//           subSiteSection: `insight:${zoneLocation}`,
//           channel: window?.appNameForSiteCat,
//           deviceType: window?.uxNameForSiteCat,
//           sitePlatform: 'omni',
//           insightUseCaseId: `${locationPrefix}_${nivData?.useCaseId}`,
//           languageType,
//           onClickEvent: `omni:customer dashboard:${insightStatus}`,
//           customerSegment: `customer type ${
//             customerTypeCode?.toLowerCase() || 'r'
//           }`,
//           productCode: getSessionStorageItem('productCodeListForTealium') || '',
//           transactionStatus: insightStatus
//         }
//         dissmissNIVHandler(nivData?.customID)
//         tealiumEvent(eventDetails, 'onClick')
//       }

//       return
//     }
//     if (action.storyModal) {
//       Logger.info({
//         // @ts-ignore
//         eventSource: {
//           businessCapability: 'SMB_ACCOUNT_LIST',
//           businessFunctionality: 'SMB_ACCOUNT_LISTING_NIV_MODAL_TRIGGERED',
//           component: 'ACCOUNT_LISTING',
//           stepName: stepName.nivModalOpen
//         },
//         eventStatus: 'INFO'
//       })
//       setSelectedInsightData({
//         showModal: true,
//         selectedLowBal:
//           nivData?.insightId === 'SMB_LowBalanceAlert_OD' ||
//           nivData?.insightId === 'SMB_LowBalanceAlert_SchedTrans'
//             ? nivData.customID
//             : '',
//         selectedInsight:
//           nivData?.insightId === 'SMB_LowBalanceAlert_OD' ||
//           nivData?.insightId === 'SMB_LowBalanceAlert_SchedTrans'
//             ? ''
//             : nivData.customID
//       })
//       setShowModal(true)
//     } else if (action.url) {
//       window.sessionStorage.setItem('AccountToken', nivData.accountToken)
//       window.location.href = replaceAfToken(action.url)
//     } else {
//       // @TODO: logging
//     }
//   }
//   const handleAnchorClick = async (e) => {
//     await handleInsightEvent()
//     e.preventDefault()
//     const urlToRedirect = e.target.href
//     window.location.href = replaceAfToken(urlToRedirect)
//   }

//   return (
//     nivs?.length > 0 &&
//     nivs.map((niv, index) => {
//       const {
//         insightId: insightName,
//         ccPaymentAssistance,
//         priority,
//         text,
//         actions,
//         customID,
//         accountToken
//       } = niv
//       const customStyle = getStylefromPriority(priority)
//       let actionsArray = []

//       if (Array.isArray(actions)) {
//         actionsArray = actions
//       } else {
//         // converting in to array as aem does not use array incase of single object
//         actionsArray = [actions]
//       }

//       return (
//         // eslint-disable-next-line react/no-array-index-key
//         <React.Fragment key={`${accountToken}-${index}`}>
//           {ccPaymentAssistance ? (
//             <div />
//           ) : (
//             <div className="notif_wrapper" id={id} style={customStyle}>
//               <div
//                 style={{
//                   backgroundColor: priority === 1 ? '#FAEDEF' : '#EFF3FC'
//                 }}
//               >
//                 <Grid>
//                   <USBColumn
//                     layoutOpts={{
//                       display: 'block',
//                       justify: 'left',
//                       align: 'center',
//                       spans: { large: 10, medium: 5, small: 4 }
//                     }}
//                   >
//                     <div className="notif_body" ref={teaserElementRef}>
//                       {priority !== null && priority !== undefined && (
//                         <div className="notif_icon">
//                           {priority === 1 ? (
//                             <USBIconWarning size="18" colorVariant="error" />
//                           ) : (
//                             <USBIconInfo size="18" colorVariant="interaction" />
//                           )}
//                         </div>
//                       )}
//                       <div className="notif_desc">{text}</div>
//                     </div>
//                   </USBColumn>
//                   <USBColumn
//                     align="end"
//                     justify="end"
//                     layoutOpts={{
//                       align: 'center',
//                       justify: 'end',
//                       spans: { large: 6, medium: 3, small: 4 }
//                     }}
//                   >
//                     {actionsArray?.length && (
//                       <div className="notification-actions">
//                         {actionsArray.map((action, i) => {
//                           const uniqueKey = i * 2
//                           const cta =
//                             action.type === 'button' ? (
//                               <React.Fragment key={uniqueKey}>
//                                 <USBButton
//                                   spacing={{
//                                     margin: 0,
//                                     padding: 10
//                                   }}
//                                   addClasses="insightsLinkStyle"
//                                   handleClick={
//                                     () => handleButtonClick(action, niv)
//                                     // eslint-disable-next-line react/jsx-curly-newline
//                                   }
//                                   variant="text"
//                                   size="Small"
//                                 >
//                                   {action.text}
//                                 </USBButton>
//                                 {selectedInsightData.selectedLowBal ===
//                                   customID &&
//                                   action.storyModal && (
//                                     <>
//                                       <React.Suspense>
//                                         <LowBalanceModal
//                                           accountLastDigit={accountLastDigit}
//                                           accountName={accountName}
//                                           dismissHandler={
//                                             (matchID) =>
//                                               dissmissNIVHandler(matchID)
//                                             // eslint-disable-next-line react/jsx-curly-newline
//                                           }
//                                           accountToken={accountToken}
//                                           alertTypeCode="BAL"
//                                           customID={nivs}
//                                           showModalChange={showModalChange}
//                                           LowBalanceFeedBack={
//                                             LowBalanceFeedBack
//                                           }
//                                         />
//                                       </React.Suspense>
//                                     </>
//                                   )}
//                                 {selectedInsightData.selectedInsight ===
//                                   customID &&
//                                   action.storyModal && (
//                                     <>
//                                       <StoryPageModal
//                                         isOpened={showModal}
//                                         handleModalFn={setShowModal}
//                                         action={action}
//                                         tokenProps={{
//                                           insightID: customID,
//                                           accountToken
//                                         }}
//                                         insightName={insightName}
//                                         selectedInsightData={
//                                           selectedInsightData
//                                         }
//                                         dismissHandler={() => {
//                                           dissmissNIVHandler(customID)
//                                         }}
//                                       />
//                                     </>
//                                   )}
//                               </React.Fragment>
//                             ) : (
//                               <USBLink
//                                 linkType="basic"
//                                 addClasses="insightsLinkStyle"
//                                 href={action.url ?? '#'}
//                                 spacing={{
//                                   margin: 0,
//                                   padding: 10
//                                 }}
//                                 handleClick={() => handleAnchorClick(niv)}
//                                 key={uniqueKey}
//                               >
//                                 {action.text}
//                               </USBLink>
//                             )

//                           return cta
//                         })}
//                       </div>
//                     )}
//                   </USBColumn>
//                 </Grid>
//               </div>
//             </div>
//           )}
//         </React.Fragment>
//       )
//     })
//   )
// }

// export default NotificationList
