const { handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const log = require('../../src/util/log.js');

// const integrationSdk = flexIntegrationSdk.createInstance({
//   // These two env vars need to be set in the `.env` file.
//   clientId: process.env.FLEX_INTEGRATION_CLIENT_ID,
//   clientSecret: process.env.FLEX_INTEGRATION_CLIENT_SECRET,

//   // Normally you can just skip setting the base URL and just use the
//   // default that the `createInstance` uses. We explicitly set it here
//   // for local testing and development.
//   baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com',
// });
ß;
module.exports = (req, res) => {
  const { email, metadata } = req.body;

  // const sdk = getSdk(req, res);

  flexIntegrationSdk.users
    .show({ email })
    .then(userResponse => {
      const user = userResponse.data.data;

      // console.log(user);

      // const trustedSdk = getTrustedSdk(req);

      return flexIntegrationSdk.users.updateProfile(
        {
          id: user.id.uuid,
          metadata,
        },
        {
          expand: true,
          'fields.user': ['email', 'profile.metadata'],
        }
      );
    })
    .then(apiResponse => {
      const { status, statusText, data } = apiResponse;
      res
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
