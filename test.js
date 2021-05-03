const { exchangeAuthorizeCode, createMeetingRoom } = require('./server/zoom');

(async () => {
  try {
    const data = await createMeetingRoom({
      userId: '0lnuaWM1Sxq-ADpUprElOw',
      accessToken:
        'eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI3YjhjYmMzYi1mNDMzLTRiYTQtYTk1Mi0yNTdiYWE5OWMyNmMifQ.eyJ2ZXIiOjcsImF1aWQiOiI2NmU1NTI4Yjg3NzU3YmUyMTkwM2M5ZDNhMjBhOTFiYyIsImNvZGUiOiJ5ZzlPWXZBUmdCXzBsbnVhV00xU3hxLUFEcFVwckVsT3ciLCJpc3MiOiJ6bTpjaWQ6UGdQQWtZR1R1cTZ0SUNKRE15NEJ3IiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6IjBsbnVhV00xU3hxLUFEcFVwckVsT3ciLCJuYmYiOjE2MjAwMjk4NjksImV4cCI6MTYyMDAzMzQ2OSwiaWF0IjoxNjIwMDI5ODY5LCJhaWQiOiJhQVZDTEFKLVFYdTFIelZYd2NmdXZRIiwianRpIjoiZmUxMmQ0OTctOTRlNy00NDRiLWFlOGUtZDQ2OWIyMWNkOTRhIn0.o8we8Pw9F1UYQNr3bCwm7gQ4MBh3dzDPzRbUJGiTFnQBOtKQI0vuAd9mdcWVdIWchJS_ajufvg_m25SwTkOxLQ',
    });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
})();
