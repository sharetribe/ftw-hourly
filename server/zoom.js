const axios = require('axios').default;
const { encode, decode } = require('js-base64');

const exchangeAuthorizeCode = async (code, { clientId, clientSecret, callbackUrl }) => {
  const { data } = await axios.post(
    `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${callbackUrl}`,
    null,
    {
      headers: {
        authorization: `Basic ${encode(`${clientId}:${clientSecret}`)}`,
      },
    }
  );
  return data;
};

module.exports = {
  exchangeAuthorizeCode,
};
