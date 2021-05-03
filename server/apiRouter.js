/**
 * This file contains server side endpoints that can be used to perform backend
 * tasks that can not be handled in the browser.
 *
 * The endpoints should not clash with the application routes. Therefore, the
 * endpoints are prefixed in the main server where this file is used.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { deserialize, getTrustedSdk } = require('./api-util/sdk');

const initiateLoginAs = require('./api/initiate-login-as');
const loginAs = require('./api/login-as');
const transactionLineItems = require('./api/transaction-line-items');
const initiatePrivileged = require('./api/initiate-privileged');

const transitionPrivileged = require('./api/transition-privileged');

const createUserWithIdp = require('./api/auth/createUserWithIdp');

const { authenticateFacebook, authenticateFacebookCallback } = require('./api/auth/facebook');
const { authenticateGoogle, authenticateGoogleCallback } = require('./api/auth/google');
const { getSdk, getRootSdk } = require('./api-util/sdk');
const { exchangeAuthorizeCode } = require('./zoom');
const router = express.Router();

// ================ API router middleware: ================ //

// Parse Transit body first to a string
router.use(
  bodyParser.text({
    type: 'application/transit+json',
  })
);

// Deserialize Transit body string to JS data
router.use((req, res, next) => {
  if (req.get('Content-Type') === 'application/transit+json' && typeof req.body === 'string') {
    try {
      req.body = deserialize(req.body);
    } catch (e) {
      console.error('Failed to parse request body as Transit:');
      console.error(e);
      res.status(400).send('Invalid Transit in request body.');
      return;
    }
  }
  next();
});

// ================ API router endpoints: ================ //
router.get('/me', async (req, res) => {
  try {
    const sdk = getSdk(req, res);
    const user = await sdk.currentUser.show();
    res.json(user);
  } catch (err) {
    console.log(err.data);
    res.status(500).json(err.toString());
  }
});

router.get('/zoom/authorize', async (req, res) => {
  try {
    const { code } = req.query;
    console.log(code);
    const sdk = getSdk(req, res);
    const user = await sdk.currentUser.show();
    const data = await exchangeAuthorizeCode(code, {
      clientId: 'PgPAkYGTuq6tICJDMy4Bw',
      clientSecret: 'nZzw7ZYH64S5ofgjZF3xxAKj8jVZPzE7',
      callbackUrl: 'http://localhost:3000/zoom',
    });
    const oldPrivateData = user.data.data.attributes.profile.privateData;
    await sdk.currentUser.updateProfile({
      privateData: {
        ...oldPrivateData,
        isConnectZoom: true,
        zoomData: data,
      },
    });
    res.json(data);
  } catch (err) {
    console.log(err.toString());
    res.status(500).send(err.toString());
  }
});

router.post('/appointment/accept', async (req, res) => {
  try {
    const sdk = getSdk(req, res);
    const tran = await sdk.transactions.show({ id: req.body.id });
    // console.log(data);
    require('fs').writeFileSync('test.json', JSON.stringify(tran));
  } catch (err) {
    console.log(err.toString());
    res.status(500).send(err.toString());
  }
});
router.get('/appointment/test', async (req, res) => {
  try {
    const sdk = getRootSdk();

    const {
      data: { data, included },
    } = await sdk.transactions.show({
      id: '608f748d-d6eb-46a9-8920-2ebaac0cf277',
      include: 'customer,booking,provider',
    });
    // res.json({ data });
    const [provider, customer, booking] = included;

    const [providerInfo, customerInfo] = await Promise.all([
      sdk.users.show({ id: provider.id }),
      sdk.users.show({
        id: customer.id.uuid,
      }),
    ]);
    res.json({ providerInfo, customerInfo, booking });
  } catch (err) {
    console.log(err.toString());
    res.status(500).send(err.toString());
  }
});

router.get('/initiate-login-as', initiateLoginAs);
router.get('/login-as', loginAs);
router.post('/transaction-line-items', transactionLineItems);
router.post('/initiate-privileged', initiatePrivileged);
router.post('/transition-privileged', transitionPrivileged);

// Create user with identity provider (e.g. Facebook or Google)
// This endpoint is called to create a new user after user has confirmed
// they want to continue with the data fetched from IdP (e.g. name and email)
router.post('/auth/create-user-with-idp', createUserWithIdp);

// Facebook authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Facebook
router.get('/auth/facebook', authenticateFacebook);

// This is the route for callback URL the user is redirected after authenticating
// with Facebook. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Flex API to authenticate user to Flex
router.get('/auth/facebook/callback', authenticateFacebookCallback);

// Google authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Google
router.get('/auth/google', authenticateGoogle);

// This is the route for callback URL the user is redirected after authenticating
// with Google. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Flex API to authenticate user to Flex
router.get('/auth/google/callback', authenticateGoogleCallback);

module.exports = router;
