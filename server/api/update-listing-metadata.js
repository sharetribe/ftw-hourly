const { integrationSdk, handleError, serialize } = require('../api-util/sdk');

module.exports = (req, res) => {
  const { listingId, metadata } = req.body;

  return integrationSdk.listings
    .update({
      id: listingId,
      metadata,
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
