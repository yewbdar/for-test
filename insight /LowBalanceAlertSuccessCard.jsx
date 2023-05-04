const CustomTooltip = (prop) => {
    const { payload } = prop
    const options = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }
    const dateLabel = payload[0]?.payload?.month
    const amt = payload[0]?.payload?.value

    const accountBalance = Number(amt).toLocaleString('en', options)
    return (
        <>
            <div className="custom-tooltip">
                <div className="custom-tooltip-wrapper">
                    <p className="rechart-tooltip-title">
                        {dateLabel}
                    </p>
                    <p className="rechart-tooltip-value">
                        ${accountBalance}
                    </p>
                </div>
            </div>
        </>
    )
}
