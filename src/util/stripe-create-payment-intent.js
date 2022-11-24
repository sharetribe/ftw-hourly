import Stripe from 'stripe';
import flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

const stripe = new Stripe('sk_test_...', {
  apiVersion: '2022-11-15',
});

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

export default createPaymentIntent = (amount, userId) => {
  // Create a PaymentIntent with the order amount and currency

  return integrationSdk.trustedSdk.users
    .show({ id: userId, include: ['stripeAccount'] })
    .then(res => {
      const stripeAccountId = res.data.data;
      log.error(stripeAccountId);

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
        })
        .then(paymentIntent => {
          return paymentIntent.client_secret;
        });
    })
    .catch(e => {
      console.log(e);
    });
};
