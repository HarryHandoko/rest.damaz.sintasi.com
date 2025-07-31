const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false, // change to true on production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

module.exports = snap;
