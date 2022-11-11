const { integrationSdk, handleError, serialize } = require('../../server/api-util/sdk');

module.exports = (req, res) => {
  const { email, metadata } = req.body;

  integrationSdk.users
    .show({ email })
    .then(userResponse => {
      const user = userResponse.data.data;

      return integrationSdk.users.updateProfile(
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
