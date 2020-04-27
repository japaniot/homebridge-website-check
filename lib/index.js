const packageJson = require('../package.json')
const {monitor} = require('./check')

// Lazy-initialized.
let homebridgeApi, Service, Characteristic

// Called by homebridge.
module.exports = (homebridge) => {
  homebridgeApi = homebridge
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  // Register the accessory.
  homebridge.registerAccessory(packageJson.name, "WebsiteCheck", WebsiteCheck)
}

class WebsiteCheck {
  constructor(log, config, api) {
    this.log = log
    this.config = config

    this._detected = false
    this._timeout = null

    this._service = new Service.MotionSensor(config.name)
    this._service.getCharacteristic(Characteristic.MotionDetected)
    .on('get', (callback) => callback(null, this._detected))

    monitor(config.url, config.selector, config.ignoreText, config.interval, (content) => {
      this._detected = true
      this._service.getCharacteristic(Characteristic.MotionDetected).updateValue(true)
      if (this._timeout) {
        clearTimeout(this._timeout)
      }
      this._timeout = setTimeout(() => {
        this._detected = false
        this._service.getCharacteristic(Characteristic.MotionDetected).updateValue(false)
        this._timeout = null
      }, Math.max(10 * 1000, config.interval))
    })
  }

  getServices() {
    return [this._service]
  }
}
