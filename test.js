const { exchangeAuthorizeCode } = require('./server/zoom');

(async () => {
  try {
    const res = await exchangeAuthorizeCode('5DlROX7Ay1_0lnuaWM1Sxq-ADpUprElOw', {
      clientId: 'PgPAkYGTuq6tICJDMy4Bw',
      clientSecret: 'nZzw7ZYH64S5ofgjZF3xxAKj8jVZPzE7',
      callbackUrl: 'http://localhost:3000/zoom',
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
})();
