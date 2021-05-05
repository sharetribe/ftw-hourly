const axios = require('axios').default;

axios
  .post(
    `https://api.zoom.us/v2/users/dkh0rziJSbqytmKfGuNesw/meetings`,
    {
      topic: 'Savante.me Meeting',

      start_time: '2021-06-04T18:00:00.000Z',
      duration: 60,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        registrants_email_notification: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI0NmVmZGFmNi02MDk0LTQ3YTctODU5Mi03ZmJlYzRiNmQ4YTcifQ.eyJ2ZXIiOjcsImF1aWQiOiJhMGNkMzcwNjJkZWY2M2Y4OWZkM2Q1YTE4ZDc2ZWMzNiIsImNvZGUiOiI3V2k5RHg5aXVEX2RraDByemlKU2JxeXRtS2ZHdU5lc3ciLCJpc3MiOiJ6bTpjaWQ6THdJMFRLVHJlN05WYmtkWkprdHciLCJnbm8iOjAsInR5cGUiOjAsInRpZCI6MCwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwidWlkIjoiZGtoMHJ6aUpTYnF5dG1LZkd1TmVzdyIsIm5iZiI6MTYyMDIwNTk3MSwiZXhwIjoxNjIwMjA5NTcxLCJpYXQiOjE2MjAyMDU5NzEsImFpZCI6InhhbWtlUGIxVDctNkJYOW9aT19kc3ciLCJqdGkiOiJjZTNjYmQwZi04YmRjLTRlMzgtYjg0ZC0wMGZiZjE1YTk2YWYifQ.Z56ZvVYQeV1fEDCeLC9XZAIkWeN-tqvi1lyQeuAK1IY_zAgx1fuvAYQPdxEmRd5AZlQEj7yNwWdiZUXpvfB2zw`,
      },
    }
  )
  .then(res => {
    console.log(res);
  });
