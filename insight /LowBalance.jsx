import React, { useState, useEffect } from 'react'
import './style.scss'
import logger from '@usb-ui-tools/logger'
import {
    USBModal,
    USBModalFooter,
    USBModalBody,
    USBModalCloseIcon
} from '@usb-shield/react-modal'
import USBButton from '@usb-shield/react-button'
import LowBalanceLoading from './LowBalanceLoading'
import LowBalanceAlertErrorCard from './LowBalanceAlertErrorCard'
import LowBalanceAlertApiErrorCard from './LowBalanceAlertApiErrorCard'
import { getLocale } from '../../../utils'
import useAemContent from '../../../hooks/AEM/useAemContent'
import * as fromConstants from '../../../constants/constants'
import LowBalanceHeader from '../../../components/molecules/LowBalanceHeader/LowBalanceHeader'
import LowBalanceAlertSuccessCard from './LowBalanceAlertSuccessCard'
import * as lowBalAemMock from '../../../../public/en-us/onlinebanking/diy/cd/smallbusiness/lowbalancealerts/low-balance-alerts.model.json'
import {
    dispatchCDInsightsSaveTealium,
    LowbalanceAlertTealium,
    onErrorLowbalanceAlertTealium,
    onSuccessLowBalanceAlertTealium
} from '../../../utils/tealium'
import * as loggerDetails from '../../../constants'
import useSessionStorage from '../../../hooks/useSessionStorage'
import ErrorBoundary from '../../../components/molecules/ErrorBoundary'

const USBWidget = React.lazy(
    () =>
        import('LowbalanceAlert/LowbalanceAlertContent').catch(
            () => ({
                default: () => <div>{/* Not found */}</div>
            })
        ) // renders in NIV not modal. avoid this
)

const LowBalanceAlertModal = (props) => {
    const {
        IS_MOCK = false,
        dismissHandler,
        customID,
        showModalChange,
        accountToken,
        LowBalanceFeedBack,
        alertTypeCode
    } = props
    const { accountLastDigit = '', accountName = '' } = props
    const locale = getLocale() || fromConstants.ENGLISH_LANG_CODE
    const { data: aemData } = useAemContent({
        service: 'lowBalanceAlert',
        serveMock: IS_MOCK,
        locale
    })

    const [modalIsOpen, setModalIsOpen] = useState(true)
    const [saveFlag, setSaveFlag] = useState(0)
    const { lowBalanceAlerts = {} } = aemData
    const { ltpModalDismiss, ltpModalSave } = lowBalanceAlerts

    const [isLoading, setIsLoading] = useState(false)
    const [onsuccessLoad, setOnsuccessLoad] = useState(false)
    const [onErrorLoader, setOnErrorLoader] = useState(false)
    const [onSaveErrorLoader, setOnSaveErrorLoader] = useState(false)
    const [onsuccessData, setOnsuccessData] = useState([])
    const showLowBal = true
    const insightUseCaseId = customID ? customID[0]?.useCaseId : ''
    const headerContentProps = {
        title: aemData
            ? aemData?.lowBalanceAlerts.title
            : lowBalAemMock.lowBalanceAlerts.title,
        ltpHeading1: aemData
            ? aemData?.lowBalanceAlerts.ltpHeading1
            : lowBalAemMock.lowBalanceAlerts.ltpHeading1,
        ltpHeading2: aemData
            ? aemData?.lowBalanceAlerts.ltpHeading2
            : lowBalAemMock.lowBalanceAlerts.ltpHeading2,
        ltpHeading3: aemData
            ? aemData?.lowBalanceAlerts.ltpHeading3
            : lowBalAemMock.lowBalanceAlerts.ltpHeading3,
        ltpHeading4: aemData
            ? aemData?.lowBalanceAlerts.ltpHeading4
            : lowBalAemMock.lowBalanceAlerts.ltpHeading4,
        ltplingkcontent: aemData
            ? aemData?.lowBalanceAlerts.ltplingkcontent
            : lowBalAemMock.lowBalanceAlerts.ltplingkcontent,
        ltpDot: aemData
            ? aemData?.lowBalanceAlerts?.ltpDot
            : lowBalAemMock.lowBalanceAlerts.ltpDot
    }

    const successCardData = {
        heading: aemData
            ? aemData?.confirmationComponent?.ltpHeading
            : lowBalAemMock.confirmationComponent.ltpHeading,
        subHeading: aemData
            ? aemData?.confirmationComponent?.ltpSubHeading
            : lowBalAemMock.confirmationComponent.ltpSubHeading,
        subHeading2: aemData
            ? aemData?.confirmationComponent?.ltpSubHeading2
            : lowBalAemMock.confirmationComponent.ltpSubHeading2,
        Symbol: aemData
            ? aemData?.confirmationComponent?.ltpSymbol
            : lowBalAemMock.confirmationComponent.ltpSymbol,
        BodyText: aemData
            ? aemData?.confirmationComponent?.ltpBodyText
            : lowBalAemMock.confirmationComponent.ltpBodyText,
        BodyLabel1: aemData
            ? aemData?.confirmationComponent?.ltpBodyLabel1
            : lowBalAemMock.confirmationComponent.ltpBodyLabel1,
        BodyLabel2: aemData
            ? aemData?.confirmationComponent?.ltpBodyLabel2
            : lowBalAemMock.confirmationComponent.ltpBodyLabel2,
        BodyDescription: aemData
            ? aemData?.confirmationComponent?.ltpBodyDescription
            : lowBalAemMock.confirmationComponent.ltpBodyDescription,
        content: aemData
            ? aemData?.confirmationComponent?.ltplinkcontent
            : lowBalAemMock.confirmationComponent.ltplinkcontent,
        dot: aemData
            ? aemData?.lowBalanceAlerts?.ltpDot
            : lowBalAemMock.confirmationComponent.ltpDot,
        successimage: aemData
            ? aemData?.confirmationComponent?.ltpSuccessImage
            : lowBalAemMock.confirmationComponent.ltpSuccessImage,
        EmailImage: aemData
            ? aemData?.confirmationComponent?.ltpEmailImage
            : lowBalAemMock.confirmationComponent.ltpEmailImage,
        MobileImage: aemData
            ? aemData?.confirmationComponent?.ltpMobileImage
            : lowBalAemMock.confirmationComponent.ltpMobileImage,
        ModelClose: aemData
            ? aemData?.confirmationComponent?.ltpModalClose
            : lowBalAemMock.confirmationComponent.ltpModalClose
    }

    useEffect(() => {
        if (
            !isLoading &&
            !onErrorLoader &&
            !onSaveErrorLoader &&
            !onsuccessLoad
        ) {
            LowbalanceAlertTealium({
                insightUseCaseId,
                siteSection: 'customer dashboard'
            })
        }
    }, [])

    const closeModal = (e) => {
        if (e.key === 'Escape') {
            showModalChange(false)
            setModalIsOpen(false)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', closeModal)
        return () => window.removeEventListener('keydown', closeModal)
    }, [])

    const onPageError = (error) => {
        if (
            error &&
            error.length !== 0 &&
            error !== fromConstants.SMB_LBA_INLINE_MIN_THRESHOLD_ERR
        ) {
            logger.error({
                eventSource: {
                    ...loggerDetails.LowBalanceAlertWidgetError,
                    subComponent:
                        loggerDetails.subComponentError.LowBalance,
                    businessFunctionality:
                        loggerDetails.subComponentError.LowBalance,
                    stepName: loggerDetails.stepName.WidgetComponent
                },
                eventStatus: loggerDetails.loggerConstants.error,
                exception: {
                    exceptionCode: error,
                    dumpAnalysis: error,
                    severity: loggerDetails.loggerConstants.high,
                    exceptionMessage:
                        loggerDetails.stepName.WidgetComponent
                }
            })
            onErrorLowbalanceAlertTealium({
                insightUseCaseId,
                siteSection: 'customer dashboard',
                errorMessage: error
            })
        }
    }
    const onError = (error, errorResponse) => {
        if (error) {
            dispatchCDInsightsSaveTealium({
                locale,
                insightUseCaseId
            })
            logger.error({
                eventSource: {
                    ...loggerDetails.LowBalanceAlertWidgetError,
                    subComponent:
                        loggerDetails.subComponentError.LowBalance,
                    businessFunctionality:
                        loggerDetails.subComponentError.LowBalance,
                    stepName: loggerDetails.stepName.APICall
                },
                eventStatus: loggerDetails.loggerConstants.error,
                exception: {
                    exceptionCode: error,
                    dumpAnalysis: errorResponse,
                    severity: loggerDetails.loggerConstants.high,
                    exceptionMessage:
                        loggerDetails.exceptionMsg.APIError
                }
            })
            setOnErrorLoader(true)
            if (errorResponse) {
                onErrorLowbalanceAlertTealium({
                    insightUseCaseId,
                    siteSection: 'customer dashboard',
                    errorCode: errorResponse.response.code,
                    errorMessage: errorResponse.response.message
                })
            }
        }
    }

    const onSaveError = (error, errorResponse) => {
        if (error) {
            dispatchCDInsightsSaveTealium({
                locale,
                insightUseCaseId
            })
            logger.error({
                eventSource: {
                    ...loggerDetails.LowBalanceAlertWidgetError,
                    subComponent:
                        loggerDetails.subComponentError.LowBalance,
                    businessFunctionality:
                        loggerDetails.subComponentError.LowBalance,
                    stepName: loggerDetails.stepName.APICall
                },
                eventStatus: loggerDetails.loggerConstants.error,
                exception: {
                    exceptionCode: error,
                    dumpAnalysis: errorResponse,
                    severity: loggerDetails.loggerConstants.high,
                    exceptionMessage:
                        loggerDetails.exceptionMsg.APIError2
                }
            })
            onErrorLowbalanceAlertTealium({
                insightUseCaseId,
                siteSection: 'customer dashboard',
                errorCode: errorResponse.response.code,
                errorMessage: errorResponse.response.message
            })
            setOnSaveErrorLoader(true)
        }
    }

    const onsuccess = (val) => {
        dispatchCDInsightsSaveTealium({
            locale,
            insightUseCaseId
        })
        if (val) {
            onSuccessLowBalanceAlertTealium({
                insightUseCaseId,
                siteSection: 'customer dashboard'
            })
            setOnsuccessLoad(true)
            setOnsuccessData(val)
        }
    }

    const onStatusLoad = (load) => {
        if (load) {
            setIsLoading(true)
        }
    }

    const loadingCardData = {
        title: aemData
            ? aemData?.loaderModalComponent?.ltpLoaderBody
            : lowBalAemMock.loaderModalComponent?.ltpLoaderBody,
        heading: aemData
            ? aemData?.loaderModalComponent?.ltpLoaderText
            : lowBalAemMock.loaderModalComponent?.ltpLoaderText
    }

    const handleDismissClick = () => {
        logger.info({
            eventSource: {
                ...loggerDetails.LBASetup,
                subComponent:
                    loggerDetails.subComponentError.LowBalance,
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
        dismissHandler(customID[0].customID)
        setModalIsOpen(false)
    }
    const saveChanges = () => {
        setSaveFlag((prevSaveFlag) => prevSaveFlag + 1)
    }
    const handleSaveClick = () => {
        logger.info({
            eventSource: {
                ...loggerDetails.LBASetup,
                subComponent:
                    loggerDetails.subComponentError.LowBalance,
                businessFunctionality:
                    loggerDetails.subComponentError.save,
                stepName: loggerDetails.stepName.Save
            },
            eventStatus: loggerDetails.loggerConstants.info,
            exception: {
                exceptionCode: loggerDetails.loggerConstants._001,
                dumpAnalysis: loggerDetails.exceptionMsg.Save,
                severity: loggerDetails.loggerConstants.high,
                exceptionMessage: loggerDetails.exceptionMsg.Save
            }
        })
        saveChanges()
    }
    if (onsuccessLoad) {
        return (
            <div>
                <LowBalanceAlertSuccessCard
                    onsuccessData={onsuccessData}
                    successCardData={successCardData}
                    showModalChange={showModalChange}
                    dismissHandler={dismissHandler}
                    customID={customID}
                    LowBalanceFeedBack={LowBalanceFeedBack}
                />
            </div>
        )
    }

    if (onErrorLoader) {
        return (
            <div>
                <LowBalanceAlertApiErrorCard
                    showModalChange={showModalChange}
                />
            </div>
        )
    }

    if (onSaveErrorLoader) {
        return (
            <div>
                <LowBalanceAlertErrorCard
                    aemData={aemData}
                    showModalChange={showModalChange}
                />
            </div>
        )
    }

    if (isLoading) {
        return (
            <div>
                <USBModal
                    id="test-modal"
                    isOpen={modalIsOpen}
                    handleClose={() => setModalIsOpen(false)}
                >
                    <USBModalBody>
                        <LowBalanceLoading {...loadingCardData} />
                    </USBModalBody>
                </USBModal>
            </div>
        )
    }
    const showModalOpen = () => {
        showModalChange(false)
        setModalIsOpen(false)
    }
    return (
        <ErrorBoundary>
            <USBModal
                id="test-modal"
                isOpen={modalIsOpen}
                handleClose={() => showModalOpen(false)}
            >
                <USBModalCloseIcon
                    modalTitle="default modal"
                    handleModalClose={() => showModalOpen(false)}
                    ariaLabel="close modal"
                />
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <USBModalBody>
                            <div>
                                <LowBalanceHeader
                                    headerContentProps={
                                        headerContentProps
                                    }
                                    accountName={accountName} // use props
                                    accountNumber={accountLastDigit}
                                />
                            </div>
                            <React.Suspense
                                fallback={
                                    <div> {/* Loader... */}</div>
                                } // renders in NIV. avaoid this
                            >
                                <USBWidget
                                    accToken={accountToken}
                                    onError={onError}
                                    onSaveError={onSaveError}
                                    onSuccess={onsuccess}
                                    onLoading={onStatusLoad}
                                    saveFlagLowBal={saveFlag}
                                    alertTypeCode={alertTypeCode}
                                    showLowBal={showLowBal}
                                    onPageError={onPageError}
                                />
                            </React.Suspense>
                            <div className="low_balance_desktop_feedback">
                                {LowBalanceFeedBack ? (
                                    <LowBalanceFeedBack
                                        customID={customID}
                                    />
                                ) : null}
                            </div>
                        </USBModalBody>
                        <USBModalFooter className="usb-modal-footer">
                            <USBButton
                                id="secondary-modal-button"
                                className="usb-modal-footer"
                                variant="secondary"
                                handleClick={handleDismissClick}
                            >
                                {ltpModalDismiss}
                            </USBButton>
                            <USBButton
                                id="primary-modal-button"
                                variant="primary"
                                handleClick={handleSaveClick}
                            >
                                {ltpModalSave}
                            </USBButton>
                        </USBModalFooter>
                    </div>
                )}
            </USBModal>
        </ErrorBoundary>
    )
}

export default LowBalanceAlertModal
