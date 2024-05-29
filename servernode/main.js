const socket = io()
    socket.on('Humidity', (data) => {
      console.log(`Humidity: ${data}`)
      document.getElementById('humidity').innerText = data
})



