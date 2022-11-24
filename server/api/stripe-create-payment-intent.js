const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const log = require('../log');

const integrationSdk = flexIntegrationSdk.createInstance({
  // These two env vars need to be set in the `.env` file.
  clientId: process.env.FLEX_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.FLEX_INTEGRATION_CLIENT_SECRET,

  // Normally you can just skip setting the base URL and just use the
  // default that the `createInstance` uses. We explicitly set it here
  // for local testing and development.
  baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com',
});

const APPLICATION_FEE_PERCENTAGE = 0.06;

const calculateOrderAmount = amount => {
  return amount + amount * APPLICATION_FEE_PERCENTAGE;
};

const calculateFeeAmount = amount => {
  return amount * APPLICATION_FEE_PERCENTAGE;
};

module.exports = (req, res) => {
  // Create a PaymentIntent with the order amount and currency

  const { userId, amount } = req.body;

  integrationSdk.users
    .show({ id: userId.uuid, include: ['stripeAccount'] })
    .then(res => {
      const stripeAccountId = res.data.data.attributes.profile.metadata.stripeAccountId;

      return stripeAccountId;
    })
    .then(stripeAccountId => {
      return stripe.paymentIntents.create({
        amount: calculateOrderAmount(amount),
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        transfer_data: {
          destination: stripeAccountId,
        },
        application_fee_amount: calculateFeeAmount(amount),
      });
    })
    .then(apiResponse => {
      const clientSecret = apiResponse.client_secret;
      log.error(apiResponse);
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
