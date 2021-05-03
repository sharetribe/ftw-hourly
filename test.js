const { sendZoomMeetingInvitation } = require('./server/sendgrid');
const { getMe, exchangeAccessTokenByRefreshToken } = require('./server/zoom');

(async () => {
  try {
    const data = await exchangeAccessTokenByRefreshToken({
      refreshToken: `eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI3N2Y2ZTQ2Ny00ZWI4LTRlOTYtYWNhYi02YjA3YmE4NjFhNmYifQ.eyJ2ZXIiOjcsImF1aWQiOiI2NmU1NTI4Yjg3NzU3YmUyMTkwM2M5ZDNhMjBhOTFiYyIsImNvZGUiOiJ5ZzlPWXZBUmdCXzBsbnVhV00xU3hxLUFEcFVwckVsT3ciLCJpc3MiOiJ6bTpjaWQ6UGdQQWtZR1R1cTZ0SUNKRE15NEJ3IiwiZ25vIjowLCJ0eXBlIjoxLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6IjBsbnVhV00xU3hxLUFEcFVwckVsT3ciLCJuYmYiOjE2MjAwMjk4NjksImV4cCI6MjA5MzA2OTg2OSwiaWF0IjoxNjIwMDI5ODY5LCJhaWQiOiJhQVZDTEFKLVFYdTFIelZYd2NmdXZRIiwianRpIjoiZGJhYzA0M2UtNGZmZi00Y2NmLThjMjctMTE4NzFlY2VmOTUxIn0.942__ML7YeFOdhI2bDOCH3VpvnbwwbjvDsPOoQ4ct7ZJAcyuPVFmXIi0LVn2-LUmLWr-hbwSOC9GCLZKmWHrpg`,
      clientId: 'PgPAkYGTuq6tICJDMy4Bw',
      clientSecret: 'nZzw7ZYH64S5ofgjZF3xxAKj8jVZPzE7',
    });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
})();
