const WebSocket = require('ws')
const path = require('path')
const fileUtils = require('../utils/file_utils')

const wss = new WebSocket.Server({
  port: 7788
})



module.exports.listen = () => {
  wss.on('connection', client => {
    console.log('有客户端链接成功了');
    client.on('message', async msg => {
      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname, filePath)
        const res = await fileUtils.getFileJsonData(filePath)
        payload.data = res
        client.send(JSON.stringify(payload))
      } else {
        wss.clients.forEach(client => {
          client.send(msg)
        })
      }
    })
  })
}