let counter = 0

const socket = io()
    socket.on('Humidity', (data) => {
      console.log(`Humidity: ${data}`)
      graficoChart.data.labels.push(counter)
      // biome-ignore lint/complexity/noForEach: <explanation>
      graficoChart.data.datasets.forEach((dataset) => {
        dataset.data.push(data.value)
      })
      counter++
      graficoChart.update()
})
