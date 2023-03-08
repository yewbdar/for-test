import React, { useState } from 'react'
import {
    USBModal,
    USBModalFooter,
    USBModalBody,
    USBModalCloseIcon
} from '@usb-shield/react-modal'
import logger from '@usb-ui-tools/logger'
import USBLink from '@usb-shield/react-link'
import USBButton from '@usb-shield/react-button'
import useMedia from '../../../hooks/Media/useMedia'
import * as fromAem from '../../../utils/aem'
import { formatCurrency } from '../../../utils'
import * as fromConstants from '../../../constants/constants'
import './style.scss'
import * as loggerDetails from '../../../constants'

const LowBalanceAlertSuccessCard = ({
    onsuccessData,
    successCardData,
    showModalChange,
    dismissHandler,
    customID,
    LowBalanceFeedBack
}) => {
    const [modalIsOpen, setModalIsOpen] = useState(true)
    const imageSucessIconProps = {
        src: fromAem.getAEMImageURL(successCardData?.successimage),
        alt: '',
        role: 'Presentation'
    }

    const imageMobileProps = {
        src: fromAem.getAEMImageURL(successCardData?.MobileImage),
        alt: '',
        role: 'Presentation'
    }
    const imageEmailProps = {
        src: fromAem.getAEMImageURL(successCardData?.EmailImage),
        alt: '',
        role: 'Presentation'
    }

    const successData = onsuccessData?.status
        ? onsuccessData?.data[0]?.apiDestinations
        : []
    const amountDataVal = onsuccessData?.status
        ? onsuccessData?.data[0]?.amount
        : '0.00'
    const amountData = formatCurrency(amountDataVal || 0)

    const EmailNotifyMe = successData.filter(
        (item) => item.type === 'EM'
    )
    const TextNotifyMe = successData.filter(
        (item) => item.type === 'SM'
    )

    const ElementNotifyMe = (Data) => {
        return Data?.map((item, i) => {
            return (
                <div className="email_text">
                    <p>
                        {item.type === 'EM'
                            ? 'Email: '
                            : 'Text message: '}
                    </p>
                    <p>{item?.value.toLowerCase()}</p>
                </div>
            )
        })
    }

    const showModalOpen = () => {
        showModalChange(false)
        setModalIsOpen(false)
    }
    const routeToProfileAndSettings = (profileandsettingslink) => {
        logger.info({
            eventSource: {
                ...loggerDetails.LBASetup,
                subComponent:
                    loggerDetails.subComponentError
                        .LowBalanceAlertSuccessCard,
                businessFunctionality:
                    loggerDetails.subComponentError.profilesettings,
                stepName: loggerDetails.stepName.profilesettings
            },
            eventStatus: loggerDetails.loggerConstants.info,
            exception: {
                exceptionCode: loggerDetails.loggerConstants._001,
                dumpAnalysis:
                    loggerDetails.exceptionMsg.profilesettings,
                severity: loggerDetails.loggerConstants.high,
                exceptionMessage:
                    loggerDetails.exceptionMsg.profilesettings
            }
        })
        let link = ''
        const accessToken = sessionStorage.getItem('AccessToken')
        if (accessToken) {
            link = fromAem?.getProfileandSettingsURL(
                profileandsettingslink
            )
        }
        return link
    }

    const dismissCloseHandler = () => {
        logger.info({
            eventSource: {
                ...loggerDetails.LBASetup,
                subComponent:
                    loggerDetails.subComponentError
                        .LowBalanceAlertSuccessCard,
                businessFunctionality:
                    loggerDetails.subComponentError.dismiss,
                stepName: loggerDetails.stepName.Dismiss
            },
            eventStatus: loggerDetails.loggerConstants.info,
            exception: {
                exceptionCode: loggerDetails.loggerConstants._001,
                dumpAnalysis: loggerDetails.exceptionMsg.Dismiss,
                severity: loggerDetails.loggerConstants.medium,
                exceptionMessage: loggerDetails.exceptionMsg.Dismiss
            }
        })
        dismissHandler(customID[0]?.customID)
        showModalOpen(false)
    }
    return (
        <>
            <USBModal
                id="lowbalance-modal"
                isOpen={modalIsOpen}
                handleClose={() => dismissCloseHandler()}
            >
                <USBModalCloseIcon
                    modalTitle="default modal"
                    handleModalClose={() => dismissCloseHandler()}
                    ariaLabel="close modal"
                />
                <USBModalBody>
                    <div
                        className="center-container"
                        data-testid="success_card"
                    >
                        <div className="lba-header">
                            <img
                                src={imageSucessIconProps.src}
                                alt="img"
                            />
                            <div className="alert-header">
                                {successCardData?.heading}
                            </div>
                        </div>
                        <div className="alert-content">
                            {successCardData?.subHeading}
                        </div>
                        <div className="balance-message">
                            {successCardData?.subHeading2}
                        </div>
                        <div className="alert-amount">
                            {amountData}
                        </div>
                        <div className="small-header">
                            {successCardData?.BodyText}
                        </div>
                        <div className="display-notify">
                            <div className="email_title">
                                <div className="email_header">
                                    <div className="email_image">
                                        {EmailNotifyMe.length > 0 ? (
                                            <img
                                                src={
                                                    imageEmailProps?.src
                                                }
                                                alt="img"
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                                <div className="email_content">
                                    {ElementNotifyMe(EmailNotifyMe)}
                                </div>
                            </div>
                            <div className="text_title">
                                <div className="text_image">
                                    {TextNotifyMe.length > 0 ? (
                                        <img
                                            src={
                                                imageMobileProps?.src
                                            }
                                            alt="img"
                                        />
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div className="text_content">
                                    {ElementNotifyMe(TextNotifyMe)}
                                </div>
                            </div>
                        </div>
                        <div className="alert-text-message">
                            {successCardData?.BodyDescription}
                            <div>
                                <USBLink
                                    href={routeToProfileAndSettings(
                                        fromConstants?.profileandSettings
                                    )}
                                >
                                    {successCardData?.content}
                                </USBLink>
                                <span>{successCardData?.dot}</span>
                            </div>
                        </div>
                        <hr />
                        {LowBalanceFeedBack && (
                            <LowBalanceFeedBack customID={customID} />
                        )}
                    </div>
                </USBModalBody>
                <USBModalFooter className="usb-modal-footer">
                    <USBButton
                        id="primary-modal-button"
                        variant="primary"
                        handleClick={() => dismissCloseHandler()}
                    >
                        {successCardData?.ModelClose}
                    </USBButton>
                </USBModalFooter>
            </USBModal>
        </>
    )
}

export default LowBalanceAlertSuccessCard
