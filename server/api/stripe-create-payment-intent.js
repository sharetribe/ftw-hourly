const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { integrationSdk, handleError, handleStripeError, serialize } = require('../api-util/sdk');
const log = require('../log');

const APPLICATION_FEE_PERCENTAGE = 0.06;

const calculateOrderAmount = amount => {
  return amount + amount * APPLICATION_FEE_PERCENTAGE;
};

const calculateFeeAmount = amount => {
  return amount * APPLICATION_FEE_PERCENTAGE;
};

module.exports = (req, res) => {
  // Create a PaymentIntent with the order amount and currency

  const { userId, amount, stripeCustomerId } = req.body;

  integrationSdk.users
    .show({ id: userId.uuid, include: ['stripeAccount'] })
    .then(res => {
      const stripeAccountId = res.data.data.attributes.profile.metadata.stripeAccountId;

      return stripeAccountId;
    })
    .then(stripeAccountId => {
      return stripe.paymentIntents
        .create({
          amount: calculateOrderAmount(amount),
          currency: 'usd',
          automatic_payment_methods: {
            enabled: true,
          },
          transfer_data: {
            destination: stripeAccountId,
          },
          application_fee_amount: calculateFeeAmount(amount),
          customer: stripeCustomerId,
        })
        .catch(e => {
          handleStripeError(res, e);
        });
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
