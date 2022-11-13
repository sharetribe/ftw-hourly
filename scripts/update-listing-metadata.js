// This dotenv import is required for the `.env` file to be read
require('dotenv').config();
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

// Read dry run from arguments
const dryRun = process.argv[2];

const integrationSdk = flexIntegrationSdk.createInstance({
  // These two env vars need to be set in the `.env` file.
  clientId: process.env.FLEX_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.FLEX_INTEGRATION_CLIENT_SECRET,

  // Normally you can just skip setting the base URL and just use the
  // default that the `createInstance` uses. We explicitly set it here
  // for local testing and development.
  baseUrl: process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com',
});

const timeout = 500;

// Takes `fns` array of functions and executes them sequentially with timeout in
// between. Timeout is needed so that we don't trigger rate limiting.
const bulkUpdate = (fns, resolve, reject, results = []) => {
  const [firstFn, ...restFns] = fns;
  if (firstFn) {
    firstFn()
      .then(res => {
        setTimeout(() => {
          bulkUpdate(restFns, resolve, reject, [...results, res]);
        }, timeout);
      })
      .catch(res => {
        reject([...results, res]);
      });
  } else {
    resolve(results);
  }
};

// Fetch all listings in marketplace and analyze how many of them need to be updated.
const analyze = integrationSdk.listings.query().then(res => {
  console.log('Total listing count:', res.data.meta.totalItems);
  const dayBased = res.data.data.filter(listing => {
    const plan = listing.attributes.availabilityPlan;
    return plan === null || plan.type === 'availability-plan/day';
  });
  console.log('Listings to migrate:', dayBased.length);
  console.log('Estimated time to run:', (dayBased.length * (timeout + 50)) / 1000 / 60, 'minutes');
  return dayBased;
});

if (dryRun === '--dry-run=false') {
  analyze
    .then(dayBasedListings => {
      return new Promise((resolve, reject) => {
        // Wrap calls to integration API in a function, that will be later
        // executed by the bulkUpdate function.
        const fns = dayBasedListings.map(listing => () => {
          const { minPrice, maxPrice } = listing.attributes.publicData;

          return integrationSdk.listings.update({
            id: listing.id,
            publicData: {
              rates: [minPrice, maxPrice],
            },
          });
        });

        console.log('here');

        // Execute
        bulkUpdate(fns, resolve, reject);
      });
    })
    .then(res => {
      console.log('Successfully updated:');
      console.log(res);
    })
    .catch(e => {
      //   console.log(e);
    });
} else {
  analyze.then(() => {
    console.log('To execute bulk update, run this command with --dry-run=false option');
  });
}
