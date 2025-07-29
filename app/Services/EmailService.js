'use strict'

const nodemailer = require('nodemailer')

class EmailService {
  static async send(to, subject, html) {
    const transporter = nodemailer.createTransport({
      host: "nvme2.natanetwork.id",
      port: 587,
      secure: false,
      auth: {
        user: "bot@medisin.id",
        pass: "Sintasi@_004400",
      },
    })

    return transporter.sendMail({
      from: `"PPDB SDIT DARUL MAZAH" <bot@medisin.id>`,
      to,
      subject,
      html,
    })
  }
}

module.exports = EmailService
