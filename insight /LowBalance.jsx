const getbarXAxis = (block) => {
    return {
        categories: block.categories
    }
}

const getYAxis = (plotLines) => {
    return {
        plotLines: [plotLines]
    }
}

function _USBPersoneticsBarChart(props) {
    const {
        block,
        plotLines,
        chartHeight,
        selectedMonthId = -1,
        indicatorValue = false
    } = props
    const { lang, noData } =
        block.series.length === 0 ? block : { lang: '', noData: '' }
    const data = block.series.map((ser, idx) =>
        idx === selectedMonthId
            ? {
                  y: indicatorValue
                      ? Math.round(ser.indicator)
                      : Math.round(ser.value)
              }
            : {
                  y: indicatorValue
                      ? Math.round(ser.indicator)
                      : Math.round(ser.value)
              }
    )
    const xAxis = getbarXAxis(block)
    const yAxis = getYAxis(plotLines)

    return (
        <>
            {block.series.length === 0 ? (
                <USBReBarChart
                    xAxis={xAxis}
                    yAxis={yAxis}
                    data={data}
                    plotLines={plotLines}
                    chartHeight={chartHeight}
                    lang={lang}
                    noData
                />
            ) : (
                <USBReBarChart
                    xAxis={xAxis}
                    yAxis={yAxis}
                    data={data}
                    plotLines={plotLines}
                    chartHeight={chartHeight}
                    noData={false}
                />
            )}
        </>
    )
}
