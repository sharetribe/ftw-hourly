module.exports = queryEvents = () => {
  const fs = require('fs');
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

  // Start polloing from current time on, when there's no stored state
  const startTime = new Date();

  // Polling interval (in ms) when all events have been fetched.
  const pollIdleWait = 300000; // 5 minutes
  // Polling interval (in ms) when a full page of events is received and there may be more
  const pollWait = 1000; // 1s

  // File to keep state across restarts. Stores the last seen event sequence ID,
  // which allows continuing polling from the correct place
  const stateFile = 'server/last-sequence-id.state';

  const queryEvents = args => {
    var filter = { eventTypes: 'user/updated, listing/updated' };
    return integrationSdk.events.query({ ...args, ...filter });
  };

  const saveLastEventSequenceId = sequenceId => {
    // Save state to local file
    try {
      fs.writeFileSync(stateFile, sequenceId.toString());
    } catch (err) {
      throw err;
    }
  };

  const loadLastEventSequenceId = () => {
    // Load state from local file, if any
    try {
      const data = fs.readFileSync(stateFile);
      return parseInt(data, 10);
    } catch (err) {
      return null;
    }
  };

  const handleEvent = event => {
    const eventType = event.attributes.eventType;

    if (eventType === 'listing/updated') {
      const userId = event.attributes.resource.relationships.author.data.id.uuid;

      const prevListingState =
        event.attributes.previousValues &&
        event.attributes.previousValues.attributes &&
        event.attributes.previousValues.attributes.state;
      const newListingState = event.attributes.resource.attributes.state;

      if (prevListingState === 'draft' && newListingState === 'pendingApproval') {
        integrationSdk.users
          .show({
            id: userId,
          })
          .then(res => {
            const user = res.data.data;
            if (user.attributes.emailVerified) {
              const listingId = event.attributes.resource.id.uuid;

              integrationSdk.listings
                .approve({
                  id: listingId,
                })
                .then(res => console.log(res))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      }
    }

    if (eventType === 'user/updated') {
      const prevEmailVerified =
        event.attributes.previousValues.attributes &&
        event.attributes.previousValues.attributes.emailVerified;
      const emailVerified = event.attributes.resource.attributes.emailVerified;

      // Maybe rewrite as (!!!undefined)
      if (prevEmailVerified !== undefined && !prevEmailVerified && emailVerified) {
        const userId = event.attributes.resource.id.uuid;

        let userListingId = null;

        integrationSdk.listings
          .query({
            authorId: userId,
          })
          .then(res => {
            userListingId = res.data.data[0].id.uuid;
            const listingState = res.data.data[0].attributes.state;

            if (listingState === 'pendingApproval') {
              integrationSdk.listings
                .approve({
                  id: userListingId,
                })
                .then(res => console.log(res))
                .catch(err => console.log(err));
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }

    saveLastEventSequenceId(event.attributes.sequenceId);
  };

  const pollLoop = sequenceId => {
    var params = sequenceId ? { startAfterSequenceId: sequenceId } : { createdAtStart: startTime };
    queryEvents(params).then(res => {
      const events = res.data.data;
      const fullPage = events.length === res.data.meta.perPage;
      const delay = fullPage ? pollWait : pollIdleWait;
      const lastEvent = events[events.length - 1];
      const lastSequenceId = lastEvent ? lastEvent.attributes.sequenceId : sequenceId;

      events.forEach(e => {
        handleEvent(e);
      });

      setTimeout(() => {
        pollLoop(lastSequenceId);
      }, delay);
    });
  };

  // Load state from local file, if any
  const lastSequenceId = loadLastEventSequenceId();

  // kick off the polling loop
  pollLoop(lastSequenceId);
};
