const axios = require('axios').default;
const { encode, decode } = require('js-base64');
const { getSdk, getRootSdk } = require('../server/api-util/sdk');
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_REDIRECT_URL = process.env.ZOOM_REDIRECT_URL;

const exchangeAuthorizeCode = async code => {
  const { data } = await axios.post(
    `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${ZOOM_REDIRECT_URL}`,
    null,
    {
      headers: {
        authorization: `Basic ${encode(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
      },
    }
  );
  return data;
};

const getMe = async ({ accessToken, refreshToken, userId }) => {
  try {
    const { data } = await axios.get('https://api.zoom.us/v2/users/me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      ...data,
      accessToken,
    };
  } catch (err) {
    const { access_token, refresh_token } = await exchangeAccessTokenByRefreshToken({
      refreshToken,
      userId,
    });
    const res = await getMe({
      accessToken: access_token,
      refreshToken: refresh_token,
      clientId: ZOOM_CLIENT_ID,
      clientSecret: ZOOM_CLIENT_SECRET,
      userId: userId,
    });
    return {
      ...res,
      accessToken: access_token,
    };
  }
};

const exchangeAccessTokenByRefreshToken = async ({ refreshToken, userId }) => {
  const { data } = await axios.post(
    `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
    null,
    {
      headers: {
        authorization: `Basic ${encode(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
      },
    }
  );
  const sdk = getRootSdk();
  const user = await sdk.users.show({
    id: userId,
  });
  const oldPrivateData = user.data.data.attributes.profile.privateData;
  await sdk.users.updateProfile({
    id: userId,
    privateData: {
      ...oldPrivateData,
      isConnectZoom: true,
      zoomData: data,
    },
  });
  return data;
};

const createMeetingRoom = async ({
  accessToken,
  refreshToken,
  userId,
  start,
  duration,
  userName,
  timezone,
}) => {
  const me = await getMe({
    accessToken: accessToken,
    refreshToken: refreshToken,
    userId: userId,
  });
  const zoomUserId = me.id;
  const formBody = {
    topic: `Savante.me Meeting: ${userName} `,
    type: 2,
    duration: 60,
    start_time: start,
    timezone,
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: true,
      registrants_email_notification: true,
    },
  };
  const { data } = await axios.post(
    `https://api.zoom.us/v2/users/${zoomUserId}/meetings`,
    formBody,
    {
      headers: {
        Authorization: `Bearer ${me.accessToken}`,
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
