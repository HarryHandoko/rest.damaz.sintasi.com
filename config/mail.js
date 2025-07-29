const mailConfig = {
  /*
  |--------------------------------------------------------------------------
  | Default mailer
  |--------------------------------------------------------------------------
  */
  mailer: 'smtp',

  /*
  |--------------------------------------------------------------------------
  | Mailers
  |--------------------------------------------------------------------------
  */
  mailers: {
    smtp: {
      driver: 'smtp',
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
        type: 'login',
      },
    },

    // log driver (untuk dev/testing)
    log: {
      driver: 'log',
    },
  },

  /*
  |--------------------------------------------------------------------------
  | From address
  |--------------------------------------------------------------------------
  */
  from: {
    address: process.env.MAIL_FROM_ADDRESS,
    name: process.env.MAIL_FROM_NAME,
  },
}

export default mailConfig
