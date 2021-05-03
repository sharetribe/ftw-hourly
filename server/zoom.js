const axios = require('axios').default;
const { encode, decode } = require('js-base64');
const qs = require('query-string');

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
const createMeetingRoom = async ({ userId, accessToken }) => {
  const testForm = {
    topic: 'Testing Meeting',

    start_time: '2021-05-04T18:00:00.000Z',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: true,
      registrants_email_notification: true,
    },
  };
  const { data } = await axios.post(`https://api.zoom.us/v2/users/${userId}/meetings`, testForm, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return data;
};
module.exports = {
  exchangeAuthorizeCode,
  createMeetingRoom,
};
