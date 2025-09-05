'use strict'

const axios = require('axios')

class WhatsappService {
  constructor() {
    this.apiKey = '49815c4ec77584611895cbae4d806303'
    this.baseUrl = 'https://wabot.sintasi.com/api' // bisa dari .env
    this.senderPhone = '082299215090'
  }

  async getDevices() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/devices`, {
        headers: {
          'secret-key': this.apiKey,
        },
      })

      const devices = response.data?.devices || []
      if (!devices.length) {
        throw new Error('No devices found')
      }

      return devices
    } catch (error) {
      throw new Error(`Failed to get devices: ${error.message}`)
    }
  }

  async getDeviceIdByPhoneNumber(phoneNumber) {
    const devices = await this.getDevices()
    const device = devices.find((d) => String(d.phone) === String(phoneNumber))

    if (!device) {
      throw new Error('Phone number not found in devices')
    }

    return device._id
  }

  async sendMessage(message, phoneNumber) {
    try {
      const id = await this.getDeviceIdByPhoneNumber(this.senderPhone)

      const response = await axios.post(
        `${this.baseUrl}/api/devices/${id}/send/${phoneNumber}`,
        {
          message: message,
        },
        {
          headers: {
            'secret-key': this.apiKey,
          },
        }
      )

      return response.data
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`)
    }
  }

}

module.exports = new WhatsappService()
