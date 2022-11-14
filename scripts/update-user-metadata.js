// This dotenv import is required for the `.env` file to be read
require('dotenv').config();
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = flexIntegrationSdk.createInstance({
  // These two env vars need to be set in the `.env` file.
  clientId: process.env.FLEX_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.FLEX_INTEGRATION_CLIENT_SECRET,

  // Normally you can just skip setting the base URL and just use the
  // default that the `createInstance` uses. We explicitly set it here
  // for local testing and development.
  baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com',
});

const emails = ['clairkaji@gmail.com'];

emails.forEach(email => {
  integrationSdk.users
    .show({ email })
    .then(res => {
      const userId = res.data.data.id;
      const userType = { userType: 'caree' };

      integrationSdk.users.updateProfile(
        {
          id: userId,
          metadata: userType,
        },
        {
          expand: true,
          'fields.user': ['email', 'profile.metadata', 'emailVerified'],
        }
      );
    })
    .catch(e => {
      throw e;
    });
});
