const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getTrustedSdk, handleError, serialize } = require('../api-util/sdk');
const log = require('../log');

module.exports = (req, res) => {
  const { isSpeculative, bodyParams, queryParams } = req.body;

  // const { ...restParams } = bodyParams && bodyParams.params ? bodyParams.params : {};

  //Make dynamic
  lineItems = transactionLineItems(2300);

  const body = {
    ...bodyParams,
    params: {
      ...bodyParams.params,
      lineItems,
    },
  };

  getTrustedSdk(req)
    .then(trustedSdk => {
      if (isSpeculative) {
        return trustedSdk.transactions.transitionSpeculative(body, queryParams);
      }
      return trustedSdk.transactions.transition(body, queryParams);
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
      log.error(res);
      handleError(res, e);
    });
};
