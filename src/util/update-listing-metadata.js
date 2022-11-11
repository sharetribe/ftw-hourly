// This dotenv import is required for the `.env` file to be read
import flexIntegrationSdk from 'sharetribe-flex-integration-sdk';

const integrationSdk = flexIntegrationSdk.createInstance({
  // These two env vars need to be set in the `.env` file.
  clientId: process.env.FLEX_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.FLEX_INTEGRATION_CLIENT_SECRET,

  // Normally you can just skip setting the base URL and just use the
  // default that the `createInstance` uses. We explicitly set it here
  // for local testing and development.
  baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com',
});

export const updateListing = (id, values) => {
  integrationSdk.listings
    .show({ id })
    .then(res => {
      const listingId = res.data.data.id;
      return integrationSdk.listings.update({
        id: listingId,
        values,
      });
    })
    .catch(e => {
      throw e;
    });
};
