import React, { Component } from 'react'
import Chart from 'chart.js'
import chroma from 'chroma-js'
import min from 'lodash/min'
import max from 'lodash/max'

const setAlpha = (dataset, alpha = 0.3) => {
  const { pointBorderColor, backgroundColor, borderColor } = dataset

  Object.assign(dataset, {
    borderColor: chroma(borderColor).alpha(alpha).css(),
    pointBorderColor: chroma(pointBorderColor).alpha(alpha).css(),
    backgroundColor: chroma(backgroundColor).alpha(alpha).css()
  })
}

const guidePlugin = {
  afterDatasetsDraw: function (chart) {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      let activePoint = chart.tooltip._active[0]
      let ctx = chart.ctx
      let yAxis = chart.scales['y-axis-0']
      let x = activePoint.tooltipPosition().x
      let topY = activePoint.tooltipPosition().y
      let bottomY = yAxis.bottom
      // draw line
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, topY)
      ctx.lineTo(x, bottomY + chart.options.layout.padding.bottom)
      ctx.lineWidth = 1
      ctx.strokeStyle = '#344758'
      ctx.stroke()
      ctx.restore()
    }
  }
}

const ShadowLineElement = Chart.elements.Line.extend({
  draw () {
    const { ctx } = this._chart

    const originalStroke = ctx.stroke

    ctx.stroke = () => {
      ctx.save()
      ctx.shadowColor = chroma(this._model.borderColor).alpha(0.2).css()
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 12
      originalStroke.apply(ctx, arguments)
      ctx.restore()
    }

    Chart.elements.Line.prototype.draw.apply(this, arguments)
    ctx.stroke = originalStroke
  }
})

Chart.defaults.ShadowLine = Chart.defaults.line
Chart.controllers.ShadowLine = Chart.controllers.line.extend({
  datasetElementType: ShadowLineElement
})

class MonitoringChart extends Component {
  componentDidUpdate (prevProps) {
    if (prevProps.measuresDatasets !== this.props.measuresDatasets) {
      this.measuresChart.data.datasets = this.props.measuresDatasets
      this.measuresChart.update()
    }

    if (prevProps.eventsDatasets !== this.props.eventsDatasets) {
      this.eventsChart.data.datasets = this.props.eventsDatasets
      this.eventsChart.update()
    }

    this.updateAxes()
  }

  updateAxes () {
    const edges = this.getMinMax()

    Object.assign(this.eventsChart.scales['time-x'].options.time, edges)
    Object.assign(this.measuresChart.scales['time-x'].options.time, edges)

    this.eventsChart.update({ duration: 0 })
    this.measuresChart.update({ duration: 0 })
  }

  getMinMax () {
    const { measuresDatasets } = this.props

    const edges = measuresDatasets.map((dataset) => {
      const { data } = dataset
      return [data[0].x, data[data.length - 1].x]
    })

    return {
      min: min(edges.map((e) => e[0])),
      max: max(edges.map((e) => e[1]))
    }
  }

  getXAxisConfig (display = false) {
    const edges = this.getMinMax()

    const xMin = edges.min
    const xMax = edges.max

    const conf = {
      // display,
      id: 'time-x',
      gridLines: {
        drawTicks: display,
        drawBorder: display
      },
      type: 'time',
      time: {
        min: xMin,
        max: xMax,
        tooltipFormat: 'DD.MM.YYYY'
        // displayFormats: {
        //   millisecond: 'hh:mm:ss',
        //   second: 'hh:mm:ss',
        //   minute: 'h:mm a',
        //   hour: 'hA',
        //   day: 'MMM D',
        //   week: 'll',
        //   month: 'MMM YYYY',
        //   quarter: '[Q]Q - YYYY',
        //   year: 'YYYY'
        // }
      }
    }

    if (!display) {
      conf.ticks = {
        fontColor: 'transparent'
      }
    }

    return conf
  }

  componentDidMount () {
    this.createCharts()
  }

  componentWillUnmount () {
    if (this.measuresChart) {
      this.measuresChart.destroy()
    }

    if (this.eventsChart) {
      this.eventsChart.destroy()
    }
  }

  createCharts () {
    this.measuresChart = new Chart(this.canvas, {
      plugins: [guidePlugin],
      type: 'ShadowLine',
      data: {
        datasets: this.props.measuresDatasets
      },
      options: {
        onHover (e, elems) {
          if (elems.length) {
            if (!this.hovered) {
              const elem = elems[0]
              const dataSetIndex = elem._datasetIndex

              this.data.datasets.forEach((dataset, i) => {
                if (i !== dataSetIndex) {
                  setAlpha(dataset)
                }
              })

              this.update()
            }

            this.hovered = true
          } else {
            if (this.hovered) {
              this.data.datasets.forEach((dataset) => {
                setAlpha(dataset, 1)
              })

              this.update({
                duration: 10,
                lazy: false
              })
              this.hovered = false
            }
          }
        },
        responsiveAnimationDuration: 0,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 0
          }
        },
        legend: {
          display: false
        },
        hover: {
          mode: 'point'
        },
        tooltips: {
          mode: 'point',
          cornerRadius: 2,
          backgroundColor: '#2C2B29',
          displayColors: false,
          callbacks: {
            label (tooltipItem, data) {
              return `${tooltipItem.yLabel} ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].unit}`
            }
          }
        },
        scales: {
          yAxes: [
            {
              display: false,
              type: 'logarithmic'
            }
          ],
          xAxes: [
            this.getXAxisConfig()
          ]
        }
      }
    })

    this.eventsChart = new Chart(this.eventsCanvas, {
      type: 'scatter',
      data: {
        datasets: this.props.eventsDatasets
      },
      options: {
        responsiveAnimationDuration: 0,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            left: 10,
            right: 10,
            bottom: 5
          }
        },
        legend: {
          display: false
        },
        hover: {
          mode: 'point'
        },
        scales: {
          yAxes: [
            {
              display: false,
              type: 'linear'
            }
          ],
          xAxes: [
            this.getXAxisConfig(true)
          ]
        },
        tooltips: {
          // enabled: false,
          callbacks: {
            title: function (tooltipItem, data) {
              // console.log(data.datasets[0], tooltipItem)
              return `${data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].title} – ${tooltipItem[0].xLabel}`
            },
            label: function () {
              return null
            }
          }
          // custom (tooltip) {
          //   if (tooltip.dataPoints) {
          //     console.log(_this.props.eventsDatasets[0].data)
          //   }
          // }
        }
      }
    })
  }

  render () {
    // console.log(this.props.eventsDatasets)
    return <div>
      <div className={'monitoring-chart-container'} style={{ height: '420px', position: 'relative', zIndex: 1 }}>
        <canvas width='100%' ref={(canvas) => { this.canvas = canvas }} />
      </div>
      <div className={'monitoring-chart-container'} style={{ height: '100px', marginTop: '-22px' }}>
        <canvas width='100%' ref={(canvas) => { this.eventsCanvas = canvas }} />
      </div>
    </div>
  }
}

export default MonitoringChart
