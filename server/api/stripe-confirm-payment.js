const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { integrationSdk, handleError, serialize } = require('../api-util/sdk');
const log = require('../log');

module.exports = (req, res) => {
  // Create a PaymentIntent with the order amount and currency

  const { clientSecret, elements } = req.body;

  stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {

    });
    .then(apiResponse => {
      const clientSecret = apiResponse.client_secret;
      res
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            clientSecret,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
