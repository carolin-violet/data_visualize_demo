export default class SocketService {

  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null

  callBackMapping = {}

  connected = false

  sendRetryCount = 0
  connectRetryCount = 0

  connect() {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:7788')

    this.ws.onopen = () => {
      this.connected = true
    }

    this.ws.onclose = () => {
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500)
    }

    this.ws.onmessage = msg => {
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {

        } else if (action === 'themeChange') {
          
        }
      }
    }
  }

  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  send (data) {
    if (this.connected) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }

}
