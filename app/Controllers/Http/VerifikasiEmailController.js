'use strict'

const nodemailer = require('nodemailer')
const EmailService = use('App/Services/EmailService')
const User = use('App/Models/User')

class VerifikasiEmailController {
  async sendEmail({ request, response }) {
    try {
      const email = request.input('email')['email']

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      // Simpan OTP ke database (misal table 'email_verifications')
      const dataUsers = await User.query().where('email',email).first();

      dataUsers.otp = otp;
      dataUsers.save();

      // Konfigurasi SMTP manual dari CPanel

      const mailOptions = `
          <h3>Halo,</h3>
          <p>Kode verifikasi email Anda adalah:</p>
          <h2>${otp}</h2>
          <p>Kode ini hanya berlaku selama 10 menit.</p>
          <br/>
          <p>Salam,<br/>Tim PPDB SDIT Darul Maza</p>
        `;

      // Kirim email
      await EmailService.send(dataUsers.email, 'Verifikasi Email', mailOptions)

      return response.status(200).json({
        success: true,
        message: 'OTP berhasil dikirim ke email.',
      })

    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Gagal mengirim email verifikasi.',
        error: error.message,
      })
    }
  }


  async verifikasiEmail({request,response,auth}){
    try {

      const otp = request.input('otp')

      const dataUsers = await User.query().where('id',auth.user.id).first();
      if(dataUsers.otp == otp){
        dataUsers.is_active_email = 1;
        dataUsers.save();


        // Konfigurasi SMTP manual dari CPanel

        const mailOptions = `
            <h3>Halo,</h3>
            <p>Kode verifikasi email Anda adalah:</p>
            <h2>${otp}</h2>
            <p>Kode ini hanya berlaku selama 10 menit.</p>
            <br/>
            <p>Salam,<br/>Tim PPDB SDIT Darul Maza</p>
          `;

        // Kirim email
        await EmailService.send(dataUsers.email, 'Verifikasi Email', mailOptions)

        return response.status(200).json({
          success: true,
          message: 'OTP berhasil dikirim ke email.',
        })
      }else{
        return response.status(500).json({
          success: false,
          message: 'Kode OTP salah.',
          error: error.message,
        })
      }
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Gagal verifikasi.',
        error: error.message,
      })
    }
  }
}

module.exports = VerifikasiEmailController
