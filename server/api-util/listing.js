const { getRootSdk } = require('./sdk');
const _ = require('lodash');

const getListingByUserId = async userId => {
  const root = getRootSdk();
  const {
    data: { data },
  } = await root.listings.query({
    authorId: userId,
  });
  return data;
};

const pickUserTimeZoneByUserId = async userId => {
  const userListingInfo = await getListingByUserId(userId);
  //   return userListingInfo;
  if (userListingInfo.length > 0) {
    const tz = _.get(userListingInfo, '[0].attributes.availabilityPlan.timezone');
    return tz;
  } else {
    return null;
  }
};

module.exports = {
  getListingByUserId,
  pickUserTimeZoneByUserId,
};
