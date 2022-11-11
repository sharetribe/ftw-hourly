// This dotenv import is required for the `.env` file to be read
require('dotenv').config();
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

export const updateUser = (email, values) => {
  integrationSdk.users
    .show({ email })
    .then(res => {
      const userId = res.data.data.id;
      return integrationSdk.users.updateProfile(
        {
          id: userId,
          metadata: { values },
        },
        {
          expand: true,
          'fields.user': ['email', 'profile.metadata'],
        }
      );
    })
    .then(res => {
      const attrs = res.data.data.attributes;
      console.log(`Metadata updated for user ${attrs.email}`);
      console.log(`Current metadata: ${JSON.stringify(attrs.profile.metadata, null, 2)}`);
    })
    .catch(e => {
      throw e;
    });
};
