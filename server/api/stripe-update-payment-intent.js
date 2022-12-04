const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { handleError, serialize } = require('../api-util/sdk');
const log = require('../log');

module.exports = (req, res) => {
  // Create a PaymentIntent with the order amount and currency

  const { paymentIntentId, update } = req.body;

  return stripe.paymentIntents
    .update(paymentIntentId, {
      ...update,
    })
    .then(apiResponse => {
      res
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            ...apiResponse,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
