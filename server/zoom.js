const axios = require('axios').default;
const { encode, decode } = require('js-base64');
const { getSdk, getRootSdk } = require('../server/api-util/sdk');
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

const getMe = async ({ accessToken, refreshToken, userId, clientId, clientSecret }) => {
  try {
    const { data } = await axios.get('https://api.zoom.us/v2/users/me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (err) {
    const { access_token, refresh_token } = await exchangeAccessTokenByRefreshToken({
      refreshToken,
      userId,
      clientId,
      clientSecret,
    });
    return getMe({
      accessToken: access_token,
      refreshToken: refresh_token,
      clientId: clientId,
      clientSecret: clientSecret,
      userId: userId,
    });
  }
};

const exchangeAccessTokenByRefreshToken = async ({
  refreshToken,
  clientId,
  clientSecret,
  userId,
}) => {
  const { data } = await axios.post(
    `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
    null,
    {
      headers: {
        authorization: `Basic ${encode(`${clientId}:${clientSecret}`)}`,
      },
    }
  );
  const sdk = getRootSdk();
  const user = await sdk.users.show({
    id: userId,
  });
  const oldPrivateData = user.data.data.attributes.profile.privateData;
  await sdk.currentUser.updateProfile({
    privateData: {
      ...oldPrivateData,
      isConnectZoom: true,
      zoomData: data,
    },
  });
  return data;
};

const createMeetingRoom = async ({ accessToken, clientId, clientSecret, refreshToken, userId }) => {
  console.log(accessToken, clientId, clientSecret, refreshToken, userId);
  const me = await getMe({
    accessToken: accessToken,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
    userId: userId,
  });
  const zoomUserId = me.id;
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
  const { data } = await axios.post(
    `https://api.zoom.us/v2/users/${zoomUserId}/meetings`,
    testForm,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return data;
};
module.exports = {
  exchangeAuthorizeCode,
  createMeetingRoom,
  getMe,
  exchangeAccessTokenByRefreshToken,
};
