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

const emails = [
  'asldkfj@alskdjfhj.com',
  'asdfasd@asdfasd.com',
  'peyton-hobson@uiowa.edu',
  'kjalsdfh@kjlasd.com',
  'kljhdf@askjldhf.com',
  'kajsh@kaljshf.com',
  'jklhf@kjlasdf.com',
  'kaljshd@aksjdf.com',
  'lkajsdfl@akjsldf.com',
  'kjlasf@askdjl.com',
  'kjsa@kaljdf.com',
  'lkajsfd@klajsdf.com',
  'lkjasdf@akjlasdf.com',
  'klsdjfk@aksdfjk.com',
  'person.example@example.com',
  'peyton.hobson1@gmail.com',
];

emails.forEach(email => {
  integrationSdk.users
    .show({ email })
    .then(res => {
      const userId = res.data.data.id;
      const { userType } = res.data.data.attributes.profile.publicData;

      integrationSdk.users.updateProfile(
        {
          id: userId,
          metadata: { userType },
        },
        {
          expand: true,
          'fields.user': ['email', 'profile.metadata'],
        }
      );
    })
    .catch(e => {
      throw e;
    });
});
