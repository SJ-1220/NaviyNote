import { Chart } from 'chart.js/auto'
import { useEffect, useRef } from 'react'

const MainFirstChart = () => {
  const canvasElement = useRef(null)

  useEffect(() => {
    if (canvasElement.current !== null) {
      const context = canvasElement.current
      const labels = ['월', '화', '수', '목', '금', '토', '일']

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Todo의 합',
            data: [12, 19, 3, 5, 2, 3, 7],
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      }
      const chart = new Chart(context, {
        type: 'bar',
        data: data,
        options: {
          animation: false,
          responsive: false,
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 16,
                },
                color: 'rgba(0, 51, 102, 1)',
              },
            },
            tooltip: {
              titleColor: 'rgba(0, 51, 102, 1)',
              bodyColor: 'rgba(0, 51, 102, 1)',
              footerColor: 'rgba(0, 51, 102, 1)',
            },
            title: {
              display: false,
              color: 'rgba(0, 51, 102, 1)',
            },
          },
          scales: {
            x: {
              ticks: {
                color: 'rgba(0, 51, 102, 1)',
              },
              title: {
                color: 'rgba(0, 51, 102, 1)',
              },
            },
            y: {
              ticks: {
                color: 'rgba(0, 51, 102, 1)',
              },
              title: {
                color: 'rgba(0, 51, 102, 1)',
              },
            },
          },
        },
      })

      return function cleanup() {
        chart.destroy()
      }
    }
  })
  return (
    <div>
      <canvas height="300" ref={canvasElement} />
    </div>
  )
}
export default MainFirstChart
